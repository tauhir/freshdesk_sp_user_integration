var client;

init();

async function init() {
    client = await app.initialized();
    client.events.on('app.activated', renderCustomerInfo);
}

// async function renderCustomerInfo() {
//     const textElement = document.getElementById('apptext');
//     const contactData = await client.data.get('contact');
//     const {
//       contact: { name }
//     } = contactData;
//     console.info("start");
//     console.log(contactData)
//     textElement.innerHTML = `Ticket is created by ${name}`;
// }

async function renderCustomerInfo() {
    const textElement = document.getElementById('apptext');
    const contactData = await client.data.get('contact');

    if (contactData && contactData.contact && contactData.contact.email) {

        console.log("Contact Data incoming:")
        console.info(contactData);
        const email = contactData.contact.email;
        // Replace 'https://yourbackend.com/customer-info' with your actual backend endpoint
        // and 'YOUR_API_TOKEN' with your actual API token
        console.log(email);

        const response = await fetch(`https://5e3ed6b5-db01-4262-8252-d36563dcf3c7.mock.pstmn.io/customer-info?email=${email}`, {
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
            console.info('succesfully got data from SP');
            console.info(data);
            if (data.html) {
                textElement.innerHTML = data.html;
            } else {
                textElement.innerText = "No HTML content available";
            }
            //textElement.innerHTML = data.html;

        } else {
            textElement.innerText = "Failed to fetch customer info";
        }
    } else {
        textElement.innerText = "No contact data available";
    }
}
