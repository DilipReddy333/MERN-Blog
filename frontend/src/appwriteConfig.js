import { Client, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6604c6d39ff2bd5319c3");

const storage = new Storage(client);

export default storage;
