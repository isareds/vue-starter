<template>
  <div
    class="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200"
    :class="shadow ? 'shadow': ''"
  >
    <table
      class="w-full table-auto border-collapse"
      :class="[ striped ? 'striped' : '', shadow ? 'box-shadow-light' : '']"
    >
      <thead>
        <tr class="b-y-width-1 b-y-grey-300" :class="theming.header.tr">
          <th
            v-for="(header, index) in headers"
            :key="index"
            :class="[getHeaderClass(header), ...theming.header.td, ...theming.header.text]"
            class="py-5 px-3 border-b border-gray-200 bg-gray-50 text-xs font-normal uppercase tracking-wider"
          >{{ header.label }}</th>
          <th
            v-if="actions.length || selectable"
            class="py-5 px-3 border-b border-gray-200 bg-gray-50 text-xs font-normal text-gray-500 uppercase tracking-wider"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" @click="selectable ? selectRow(row) : null" :key="index">
          <td v-for="(header, index) in headers" :key="index" class="py-6 px-3">
            <div
              class="flex flex-row items-center h-full text-gray-700"
              :class="getRowClass(header)"
            >
              <div class="flex flex-row items-center" v-if="header.type == 'avatar'">
                <img
                  :src="deepPick(row, header.fields.image)"
                  class="bg-no-repeat mr-4 bg-gray-400 bg-auto rounded-full w-12 h-12"
                />
                <div class="flex flex-col">
                  <div class="text-base mb-1">{{ deepPick(row, header.fields.title) }}</div>
                  <div class="text-xs text-gray-500">{{ deepPick(row, header.fields.description) }}</div>
                </div>
              </div>

              <div class="flex flex-row items-end" v-if="header.type == 'image'">
                <img
                  :src="deepPick(row, header.field)"
                  class="bg-no-repeat bg-gray-400 bg-auto rounded-lg w-10 h-10 object-cover"
                />
              </div>

              <div class="flex flex-row items-end" v-if="header.type == 'link'">
                <a
                  class="btn bg-blue-500 rounded-md text-white px-4 py-2"
                  :href="deepPick(row, header.fields.url_link)"
                >{{ deepPick(row, header.fields.url_name) }}</a>
              </div>

              <div class="flex flex-row items-center" v-if="header.type == 'date'">
                <span class>{{ deepPick(row, header.field) | moment(header.format) }}</span>
              </div>

              <div class="flex flex-row items-end" v-if="header.type == 'text'">
                <span class>
                  {{
                  deepPick(row, header.field, header.type)
                  }}
                </span>
              </div>

              <div class="flex flex-row items-end" v-if="header.type == 'hashtag'">
                <span
                  class="font-medium underline text-blue-700 cursor-pointer"
                >{{ deepPick(row, header.field) }}</span>
              </div>

              <template v-if="header.type == 'details'">
                <div class="flex flex-col">
                  <div class="text-base mb-1">{{ deepPick(row, header.field.title) }}</div>
                  <div class="text-xs text-gray-500">{{ deepPick(row, header.field.description) }}</div>
                </div>
              </template>

              <template v-if="header.type == 'stock'">
                <div class="flex flex-row">
                  <span class="text-base font-bold">{{ deepPick(row, header.fields.current_value) }}</span>
                  <div
                    class="ml-2"
                    :class="deepPick(row, header.fields.flow) == 'plus' ? 'text-green-600': 'text-red-500' "
                  >
                    <i
                      class="mx-1"
                      :class="deepPick(row, header.fields.flow) == 'plus' ? 'hi-trending-up' : 'hi-trending-down'"
                    ></i>
                    <span>{{ deepPick(row, header.fields.trend) }}%</span>
                  </div>
                </div>
              </template>

              <div class="flex flex-row items-center h-full" v-else-if="header.type == 'pill'">
                <span
                  class="rounded-lg px-3 py-1 text-xs"
                  :class="'pill-color-' + deepPick(row, header.field.color)"
                >{{ deepPick(row, header.field.text) }}</span>
              </div>

              <div
                class="flex flex-row items-center h-full"
                v-else-if="header.type == 'partnership'"
              >
                <div
                  class="w-5 h-5 rounded-full"
                  :class=" deepPick(row, header.field) ? 'bg-green-400' : '' "
                ></div>
              </div>

              <div
                class="h-full w-full flex flex-col items-center"
                v-else-if="header.type == 'status'"
              >
                <div
                  :class="{
                    'bg-green-400': row.isActive,
                    'bg-red-400': !row.isActive
                  }"
                  class="w-5 h-5 rounded-full bg-gray-400"
                ></div>
              </div>

              <div class="h-full flex flex-col items-end" v-else-if="header.field == 'actions'">
                <div
                  class="flex-grow flex flex-row justify-center items-center transition-all duration-75 ease-in"
                ></div>
              </div>
            </div>
          </td>
          <td
            v-if="actions.length || selectable"
            style="width: 20%"
            class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
          >
            <div class="flex flex-row items-center justify-center" v-if="!selectable">
              <popper
                :key="action.name"
                trigger="hover"
                v-for="action in getVisibileActions(row)"
              >
                <div class="popper shadow-md bg-white rounded py-1 px-2">{{ action.label }}</div>
                <button
                  slot="reference"
                  @click="actOnRow(action, index)"
                  :class="action.active"
                  class="mr-3 text-gray-500 focus:outline-none"
                >
                  <i class="fa text-xl" :class="action.icon"></i>
                </button>
              </popper>
            </div>
            <div class="flex flex-row items-center justify-center" v-else>
              <div
                class="rounded-full h-6 w-6 flex flex-row items-center justify-center hover:bg-gray-700 text-white border-2 border-gray-700"
                @click="selectRow(row)"
                :class="isSelected(row) ? 'bg-gray-700 tx-white' : 'bg-white'"
              >
                <!-- <i class="fa fa-check text-xs" :class="isSelected(row) ? 'text-white' : 'text-gray-700'"></i> -->
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="rows.length == 0">
          <td :colspan="headers.length + 2">
            <div
              class="text-center text-gray-400 font-bold text-md font-semibold bg-white py-5"
            >Nessuna riga da mostrare</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Popper from "@/components/Popper";

export default {
  name: "awesome-table",
  components: {
    popper: Popper
  },
  props: {
    rows: {},
    headers: {},
    actions: {},
    theme: { required: false, default: "indigo" },
    striped: { required: false, default: true },
    shadow: { required: false, default: true },
    selectable: { required: false, default: false }
  },
  data() {
    return {
      selected_row: null
    };
  },
  methods: {
    getRowClass(header) {
      return header.class ? header.class.row : "justify-center";
    },
    getHeaderClass(header) {
      return header.class ? header.class.header : "text-center";
    },
    getSelectedRowClass(row) {
      let row_class = "";

      if (this.selectable) {
        row_class += " hover:bg-gray-200 cursor-pointer";
        if (row.id == (this.selected_row ? this.selected_row.id : -1)) {
          row_class += " bg-gray-200";
        }
      }
      return row_class;
    },
    isSelected(row) {
      if (!this.selected_row) return false;
      return this.selected_row.id == row.id;
    },
    actOnRow(action, index) {
      this.$emit("act", {
        action,
        index
      });
    },
    selectRow(row) {
      this.selected_row = row;
      this.$emit("selected", { row: this.selected_row });
    },
    getVisibileActions(row) {
      return this.actions.filter((action) => {
        return this.getActionVisibility(action, row);
      });
    },
    getActionVisibility(action, row) {
      if (!action.visible) {
        return true;
      }

      let negative = action.visible[0] == "!";
      let field = action.visible;

      if (negative) {
        field = action.visible.substring(1, action.visible.length);
      }

      let value = this.deepPick(row, field);

      return negative ? !value : !!value;
    }
  },
  computed: {
    theming() {
      return {
        header: {
          tr: `bg-${this.theme}-100`,
          td: `bg-${this.theme}-50`,
          text: `text-${this.theme}-500`
        }
      };
    }
  }
};
</script>

<style>
.select-circle {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 1px solid var(--primary);
  transition: 0.2s ease-in-out;
}

.select-circle:hover {
  background-color: var(--primary);
}

.select-circle.selected {
  background-color: var(--primary);
}
</style>
