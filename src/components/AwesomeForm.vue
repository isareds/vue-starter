<template>
  <div>
    <loading v-if="loading"></loading>
    <div class="w-full" v-if="!loading">
      <div
        v-for="(header, index) in headers"
        :key="index"
        v-if="fieldIsVisible(header)"
        class="grid grid-cols-3 gap-4 py-5 border-b border-gray-200 flex items-center grid grid-cols-3"
      >
        <label class="font-semibold text-gray-600 text-sm" for="header.code">{{
          header.label
        }}</label>
        <template v-if="header.type == 'text'">
          <input
            type="text"
            class="form-control"
            :readonly="fieldIsReadonly(header)"
            :placeholder="header.placeholder"
            :id="header.code"
            v-model="dataForm[header.field]"
            :disabled="header.readonly"
          />
        </template>
        <template v-if="header.type == 'number'">
          <input
            type="number"
            class="form-control"
            :readonly="fieldIsReadonly(header)"
            :placeholder="header.placeholder"
            :id="header.code"
            v-model="dataForm[header.field]"
            :disabled="header.readonly"
          />
        </template>
        <template v-if="header.type == 'select'">
          <select
            class="flex-grow form-control"
            :disabled="fieldIsReadonly(header)"
            :name="header.code"
            @change="changeSelect($event, header)"
          >
            <option :value="undefined">Scegli {{ header.label }}</option>
            <option
              :selected="dataForm[header.field] == option.id"
              :key="option.id"
              v-for="option in filterOptions(header)"
              :value="option.id"
            >
              {{ option[header.select.option] | capitalize }}
            </option>
          </select>
        </template>
        <template v-if="header.type == 'dynamic-select'">
          <FormulateInput
            type='select'
            class="flex-grow form-control"
            :name="header.code"
            :readonly="fieldIsReadonly(header)"
            :label="header.select.option"
            :options="form_options[header.select.code]"
            @search="(search, event) => onSearch(search, event, header.select)"
            v-model="dataForm[header.field]"
          />
        </template>
        <template v-if="header.type == 'balance'">
          <div class="flex">
            <input
              type="number"
              :readonly="fieldIsReadonly(header)"
              :id="header.code"
              v-model="dataForm[header.field]"
              :name="header.code"
              class="form-control rounded-r-none w-24"
            />
            <div
              class="bg-gray-200 rounded rounded-l-none border border-gray-300 flex items-center border-l-0"
            >
              <span class="text-gray-600 px-3">{{ header.udm }}</span>
            </div>
          </div>
        </template>
        <template v-if="header.type == 'bool'">
          <label class="custom-label flex">
            <div
              class="bg-white shadow w-6 h-6 p-1 flex justify-center items-center mr-2"
            >
              <input
                :readonly="fieldIsReadonly(header)"
                type="checkbox"
                class="hidden"
                v-model="dataForm[header.field]"
                :id="header.code"
                :name="header.code"
              />
              <svg
                class="hidden w-4 h-4 text-green-600 pointer-events-none"
                viewBox="0 0 172 172"
              >
                <g
                  fill="none"
                  stroke-width="none"
                  stroke-miterlimit="10"
                  font-family="none"
                  font-weight="none"
                  font-size="none"
                  text-anchor="none"
                  style="mix-blend-mode:normal"
                >
                  <path d="M0 172V0h172v172z" />
                  <path
                    d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
                    fill="currentColor"
                    stroke-width="1"
                  />
                </g>
              </svg>
            </div>
          </label>
        </template>
        <template v-if="header.type == 'date'">
          <input
            :readonly="fieldIsReadonly(header)"
            type="date"
            class="form-control"
            :placeholder="header.placeholder"
            :id="header.code"
            v-model="dataForm[header.field]"
          />
        </template>
        <template v-if="header.type == 'textarea'">
          <textarea
            type="text"
            class="form-control"
            :placeholder="header.placeholder"
            :readonly="fieldIsReadonly(header)"
            :id="header.code"
            v-model="dataForm[header.field]"
          ></textarea>
        </template>
        <template v-if="header.type == 'file'">
          <div class="flex">
            <input
              type="file"
              :readonly="fieldIsReadonly(header)"
              :name="header.code"
              id="header.code"
              class="form-control rounded-r-none flex-grow"
            />
            <div
              class="bg-gray-200 rounded rounded-l-none border border-gray-300 flex items-center border-l-0"
            >
              <i class="text-gray-600 px-3 fas fa-attachment"></i>
            </div>
          </div>
        </template>
        <div class="p-2">
          <div
            class="flex flex-row align-center"
            v-if="form_validation_status[header.code]"
          >
            <span
              v-for="(error, index) in form_validation_status[header.code]
                .errors"
              :key="index"
              class="text-red-600"
              >{{ error }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { params_service } from '@/services';

export default {
  name: 'awesome-form',
  components: {},
  props: {
    is_edit: { required: false, default: false },
    form: { required: true, default: {} },
    validate: { required: false, default: false },
    headers: { required: true, default: {} },
  },
  data() {
    return {
      loading: true,
      dataForm: {},
      changedFields: {},
      oldForm: {},
      form_options: {},
      form_validation_status: {},
      form_is_valid: {},
    };
  },
  mounted() {
    this.loading = true;

    this.fetchOptions();
    this.validatedataForm();

    // Use a private clone so that we can
    // change it entirely to trigger some refresh
    this.dataForm = JSON.parse(JSON.stringify(this.form));

    this.updateOldForm(this.dataForm);

    this.loading = false;
  },
  methods: {
    options(code) {
      return this.form_options['code'];
    },
    onSearch(search, loading, param) {
      this.onSearchDebounced(search, loading, param, this);
    },
    onSearchDebounced: _.debounce(async (search, loading, param, vm) => {
      await vm.doFetchParam(search, loading, param);
    }, 400),
    async doFetchParam(search, loading, param) {
      loading(true);

      let response = await params_service.getParamType(param.url, {
        query: search,
      });
      this.form_options[param.code] = response;

      this.$forceUpdate();
      loading(false);
    },
    async fetchOptions() {
      let promises = [];
      let selectCodes = [];

      this.headers.forEach((header) => {
        if (header.type == 'select') {
          selectCodes.push(header.select.code);
          promises.push(params_service.getParamType(header.select.url));
        }
      });

      let selectValues = await Promise.all(promises);

      selectValues.forEach((values, index) => {
        this.form_options[selectCodes[index]] = values;
      });

      this.$forceUpdate();
    },
    validatedataForm() {
      if (!this.validate) return 0;

      this.form_is_valid = true;
      this.headers.forEach((header) => {
        if (!this.fieldIsVisible(header)) {
          return;
        }

        const validation_rules = header.validator;
        this.form_validation_status[header.code] = {};

        this.form_validation_status[header.code].valid = true;
        this.form_validation_status[header.code].errors = [];
        this.form_validation_status[header.code].status = 'validating';

        validation_rules.forEach((rule) => {
          switch (rule) {
            case 'required':
              if (!this.dataForm[header.field]) {
                this.form_is_valid = false;
                this.form_validation_status[header.code].valid = false;
                this.form_validation_status[header.code].errors.push(
                  'Il campo non è valido',
                );
              }
              break;
            default:
              break;
          }
        });

        this.form_validation_status[header.code].status = 'validate';
      });

      this.$emit('valid', this.form_is_valid);
    },
    fieldIsVisible(header) {
      if (header.visible == undefined) {
        return true;
      }

      let isVisible = true;

      header.visible.forEach((condition) => {
        isVisible =
          isVisible && this.evaluateCondition(condition, this.dataForm);
      });

      return isVisible;
    },
    fieldIsReadonly(header) {
      if (header.readonly == undefined) {
        return false;
      }

      let mode = this.is_edit ? 'edit' : 'create';

      // If it's false or not set I return false
      // otherwise I simply return the value
      return header.readonly[mode] != undefined ? header.readonly[mode] : false;
    },
    filterOptions(header) {
      if (header.select && header.select.filter == undefined) {
        return this.form_options[header.select.code];
      }

      let filteredOptions = [];

      filteredOptions = this.form_options[header.select.code].filter(
        (option) => {
          let isInFilter = this.evaluateCondition(
            header.select.filter,
            option,
            this.dataForm,
          );

          return isInFilter;
        },
      );

      if (this.changedFields[header.select.filter[0]]) {
        this.dataForm[header.field] = undefined;
        this.changedFields[header.select.filter[0]] = false;
        this.$forceUpdate();
      }

      return filteredOptions;
    },
    evaluateCondition(condition, object, reference = null) {
      // condition: [<field>, <operator>, <value>]
      let conditionIsMet = false;

      let conditionFieldValue = this.deepPick(object, condition[0]);
      let conditionOperator = condition[1];
      let conditionValue = condition[2];

      if (condition[2][0] == '$') {
        // Pick the value from the object not from the actual string value
        let conditionValueField = condition[2].substring(1);
        conditionValue = this.deepPick(reference, conditionValueField);
      }

      switch (conditionOperator) {
        case '=':
          conditionIsMet = conditionFieldValue == conditionValue;
          break;
        case '!=':
          // !!conditionFieldValue is for ensuring conditionFieldValue is not null or undefined
          conditionIsMet =
            !!conditionFieldValue && conditionFieldValue != conditionValue;
          break;
        case 'IN':
          conditionIsMet =
            !!conditionFieldValue &&
            conditionValue.split(',').indexOf('' + conditionFieldValue) > -1;
          break;
      }

      return conditionIsMet;
    },
    updateOldForm(newForm) {
      this.oldForm = JSON.parse(JSON.stringify(newForm));
      // Update form for parent component
      this.$emit('change', this.dataForm);
    },
    changeSelect(event, header) {
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      this.dataForm = {};
      this.dataForm = dataForm;
      this.dataForm[header.field] = event.target.value;
      this.$forceUpdate();
    },
  },
  computed: {},
  watch: {
    dataForm: {
      deep: true,
      handler(newForm) {
        this.headers.forEach((header) => {
          if (
            this.deepPick(newForm, header.field) !=
            this.deepPick(this.oldForm, header.field)
          ) {
            this.changedFields[header.field] = true;
          }
        });

        this.updateOldForm(newForm);
        this.validatedataForm();
      },
    },
  },
};
</script>

<style></style>
