import "./App.css";
import axios from "axios";
import { useState } from "react";

// Zohoinventory.FullAccess.all
// https://cors-anywhere.herokuapp.com/corsdemo

function App() {
  const client_id = process.env.REACT_APP_CLIENT_ID;

  const client_secret = process.env.REACT_APP_CLIENT_SECRET;
  const organization_id = process.env.REACT_APP_ORGANIZATION_ID;
  const refreshToken = process.env.REACT_APP_REFRESH_TOKEN;

  const corsPrefix = "https://cors-anywhere.herokuapp.com";

  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [contacts, setContacts] = useState([]);

  async function refreshAccessToken() {
    const refreshURL = `${corsPrefix}/https://accounts.zoho.in/oauth/v2/token?refresh_token=${refreshToken}&client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token`;
    const response = await axios.post(refreshURL);
    if (!response.data.error) {
      setToken(response.data.access_token);
    }
  }

  async function getItems() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/items?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    setItems(response.data.items);
    console.log(response.data.items);
  }

  async function getOrganization() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/organizations?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    setOrganizations(response.data.organizations);
  }

  async function getContacts() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/contacts?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    setContacts(response.data.contacts);
  }

  async function sendEmail(contact_id) {
    var config = {
      method: "post",
      url: `${corsPrefix}/https://inventory.zoho.in/api/v1/contacts/${contact_id}/statements/email?organization_id=60016359595`,
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Zoho-oauthtoken ${token}`,
        Origin: "http://localhost:3000",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <button onClick={refreshAccessToken}>Refresh Access Token</button>
      <h2>{token}</h2>
      <button onClick={getItems}>Get Items</button>
      <h3>
        {items.map((item) => (
          <div>{item.name}</div>
        ))}
      </h3>
      <button onClick={getOrganization}>Get Organizations</button>
      <h3>
        {organizations.map((organization) => (
          <div>{organization.name}</div>
        ))}
      </h3>
      <button onClick={getContacts}>Get contacts</button>
      <h3>
        {contacts.map((contact) => (
          <div>
            {contact.contact_name}, {contact.contact_id}
          </div>
        ))}
      </h3>
      <button onClick={() => sendEmail(`990566000000046173`)}>
        Send Email
      </button>
    </div>
  );
}

export default App;
