import { api } from "@/utils/api";

export default {
  async get_users() {
    return await api.list("users");
  },
  async save_user(user) {
    if (user._id) {
      // edit user
      return await api.update("users", user._id, user);
    } else {
      // create user
      return await api.create("users", user);
    }
  },
  async get_create_customer_params() {
    return {
      citizenships: await this.getParamType('citizenships'),
      rae_codes: await this.getParamType('rae_codes'),
      sae_codes: await this.getParamType('sae_codes'),
      company_types: await this.getParamType('company_types'),
      customer_types: await this.getParamType('customer_types')
    }
  },
  async get_customer(id) {
    return api.list('customer/' + id);
  },
  async create_customer(customer) {
    return api.post(`customer/${customer.id || 0 }`, { customer });
  },
  async getParamType(name) {
    return api.list('params/' + name);
  }
}
