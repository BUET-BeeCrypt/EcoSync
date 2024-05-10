import { api_url } from ".";
import axios from "axios";

export const getContractorCompanys = async () =>
  axios.get(api_url("/contractor")).then((res) => res.data);

export const getContractorCompany = async (contract_company_id) =>
  axios
    .get(api_url(`/contractor/${contract_company_id}`))
    .then((res) => res.data);

export const addContractorCompany = async (
  name,
  contract_id,
  registration_date,
  tin,
  contact_number,
  workforce_size,
  ton_payment_rate,
  required_ton,
  contract_duration,
  collection_area,
  sts_id
) =>
  axios
    .post(api_url("/contractor"), {
      name,
      contract_id,
      registration_date,
      tin,
      contact_number,
      workforce_size,
      ton_payment_rate,
      required_ton,
      contract_duration,
      collection_area,
      sts_id,
    })
    .then((res) => res.data);

export const updateContractorCompany = async (
  contract_company_id,
  name,
  contract_id,
  registration_date,
  tin,
  contact_number,
  workforce_size,
  ton_payment_rate,
  required_ton,
  contract_duration,
  collection_area,
  sts_id
) =>
  axios
    .put(api_url(`/contractor/${contract_company_id}`), {
      name,
      contract_id,
      registration_date,
      tin,
      contact_number,
      workforce_size,
      ton_payment_rate,
      required_ton,
      contract_duration,
      collection_area,
      sts_id,
    })
    .then((res) => res.data);

export const deleteContractorCompany = async (contract_company_id) =>
  axios
    .delete(api_url(`/contractor/${contract_company_id}`))
    .then((res) => res.data);

export const assignManagaerToContractorCompany = async (
  contract_company_id,
  user_id
) =>
  axios
    .post(api_url(`/contractor/${contract_company_id}/managers`), {
      user_id,
    })
    .then((res) => res.data);

export const getManagersOfContractorCompany = async (contract_company_id) =>
  axios
    .get(api_url(`/contractor/${contract_company_id}/managers`))
    .then((res) => res.data);

export const removeManagerFromContractorCompany = async (
  contract_company_id,
  user_id
) =>
  axios
    .delete(api_url(`/contractor/${contract_company_id}/managers/${user_id}`))
    .then((res) => res.data);

export const getContractorCompanyId = async () => {
  return axios.get(api_url("/contractor/id")).then((res) => res.data);
}

export const createOrUpdateWorkers = async (workers) => {
  return axios.put(api_url("/contractor/workforce"), workers).then((res) => res.data);
}

export const getContractorWorkers = async () => {
  return axios.get(api_url("/contractor/workforce")).then((res) => res.data);
}

export const getSTSofContractor = async () => 
  axios.get(api_url("/contractor/sts")).then((res) => res.data);