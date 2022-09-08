import "./App.css";
import axios from "axios";
import { useState } from "react";

// Zohoinventory.FullAccess.all
// https://cors-anywhere.herokuapp.com/corsdemo

const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const organization_id = process.env.REACT_APP_ORGANIZATION_ID;
const refreshToken = process.env.REACT_APP_REFRESH_TOKEN;

const corsPrefix = "https://cors-anywhere.herokuapp.com";

function App() {

  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [invoices, setInvoices] = useState([]);

  async function refreshAccessToken() {
    const url = `${corsPrefix}/https://accounts.zoho.in/oauth/v2/token?refresh_token=${refreshToken}&client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token`;
    const response = await axios.post(url);
    if (!response.data.error) {
      setToken(response.data.access_token);
      console.log(response.data.access_token);
    }
  }

  async function createItem(item) {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/items?organization_id=${organization_id}`;
    const response = await axios.post(url, item, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data);
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

  async function createOrder(order) {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/salesorders?organization_id=${organization_id}`;
    const response = await axios.post(url, order, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
      params: {
        ignore_auto_number_generation: true,
      },
    });
    console.log(response.data);
  }


  async function getOrders() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/salesorders?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data);
  }


  async function createInvoice(invoice) {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/invoices?organization_id=${organization_id}`;
    const response = await axios.post(url, invoice, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data);
  }
  
  async function markInvoiceAsSent(invoice_id){
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/invoices/${invoice_id}/status/sent?organization_id=${organization_id}`;
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data);
  }

  async function getInvoices() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/invoices?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data.invoices);
    setInvoices(response.data.invoices);
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

  async function createContact(contact) {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/contacts?organization_id=${organization_id}`;
    const response = await axios.post(url, contact, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    console.log(response.data);
  }

  async function getContacts() {
    const url = `${corsPrefix}/https://inventory.zoho.in/api/v1/contacts?organization_id=${organization_id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    setContacts(response.data.contacts);
    console.log(response.data.contacts);
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
      <br />
      <button
        onClick={() =>
          createItem({
            item_type: "inventory",
            product_type: "goods",
            is_taxable: true,
            description: "description",
            name: "Bags-small2",
            rate: 6,
            sku: "sku123456",
          })
        }
      >
        Create Item
      </button>
      <br />
      <button
        onClick={() =>
          createOrder({
            customer_id: "990566000000046173",
            salesorder_number: "SO-00001",
            line_items: [
              {
                item_id: "990566000000091272",
                name: "bags-small2",
                item_type: "inventory",
                product_type: "goods",
                is_taxable: true,
                description: "description",
                rate: 6,
                sku: "sku123456",
              },
            ],
          })
        }
      >
        Create Order
      </button>
      <br />
      <button onClick={getOrders}>Get Orders</button>
      <br />
      <button onClick={getInvoices}>Get Invoices</button>
      <h5>
        {invoices.map((invoice) => (
          <div>
            {invoice.invoice_id}, {invoice.invoice_url}
          </div>
        ))}
      </h5>
      <button
        onClick={() =>
          createInvoice({
            customer_id: "990566000000046173",
            line_items: [
              {
                item_id: "990566000000091272",
                name: "bags-small2",
                item_type: "inventory",
                product_type: "goods",
                is_taxable: true,
                description: "description",
                rate: 6,
                sku: "sku123456",
              },
            ],
          })
        }
      >
        Create Invoice
      </button>
      <button onClick={() => markInvoiceAsSent('990566000000047174')}>Mark invoice as sent</button>
    </div>
  );
}

export default App;
