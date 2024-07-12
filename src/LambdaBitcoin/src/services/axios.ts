import axios from "axios";
import getSecret from "./secret-manager";

export default axios.create({
  baseURL: (await getSecret('baseurl')).SecretString
});