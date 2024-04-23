var client;

init();

async function init() {
    client = await app.initialized();
    client.events.on('app.activated', renderCustomerInfo);
}

async function renderCustomerInfo() {
    const textElement = document.getElementById('apptext');
    const contactData = await client.data.get('contact');

    if (contactData && contactData.contact && contactData.contact.email) {
        const email = contactData.contact.email;
        // Replace 'https://yourbackend.com/customer-info' with your actual backend endpoint
        // and 'YOUR_API_TOKEN' with your actual API token
        const response = await fetch(`https://yourbackend.com/customer-info?email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer API_TOKEN',
            },
        });

        if (response.ok) {
            // JSON should contain a list of users with their client group ids, status, and number of xero connections
            //It can also contain the HTML that we've previously used.
            //Company is a Client Group in our sense
            // {
            //     "users": {
            //       "G1234":
            //         {
            //           "CG Name": "Test CG",
            //           "HVC": true,
            //           "Role": "Payroll admin"
            //         },
            //           "G1235":
            //         {
            //           "CG Name": "Test CG2",
            //           "HVC": false,
            //           "Active Role": "billing only user"
            //         }
            //     },
            //     "html": "html_content"
            //   }

            //check if company exists 
            //update client groups
            //update HVC if it is one

            // as a V1, just update the html with what was given
            const data = await response.json();
            textElement.innerHTML = data.html;
        } else {
            textElement.innerText = "Failed to fetch customer info";
        }
    } else {
        textElement.innerText = "No contact data available";
    }
}
