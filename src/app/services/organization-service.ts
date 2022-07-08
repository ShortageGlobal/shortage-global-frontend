import axios from 'axios';
import { API_ROOT } from 'app/constants';

export function fetchOrganizations() {
  return axios.get(`${API_ROOT}/api/organizations/`);
}
