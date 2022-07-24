import axios from 'axios';
import { API_ROOT } from 'app/constants';

export function fetchPromotedOrganizations() {
  return axios.get(`${API_ROOT}/api/promoted/organizations/`);
}
