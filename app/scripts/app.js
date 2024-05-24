document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      app.initialized()
        .then(function (client) {
          client.events.on("app.activated", function () {
            renderCustomerInfo(client);
          });
        })
        .catch(handleErr);
    }
  };
  
  async function renderCustomerInfo(client) {
    const textElement = document.getElementById('apptext');
    const contactData = await client.data.get('contact');
  
    if (contactData && contactData.contact && contactData.contact.email) {
  
      const email = contactData.contact.email;
  
      try {
        const options = {
          context: {
            email: email
          }
        };
  
        const data = await client.request.invoke("fetchCustomerInfo", options);
  
        console.log("Server method Request ID is: " + data.requestID);
  
        if (data.response) {
          const responseData = JSON.parse(data.response.response);
          console.info('Successfully got data from backend:');
  
          if (responseData.html) {
            textElement.innerHTML = responseData.html;
          } else {
            textElement.innerText = "No HTML content available";
          }
        } else {
          textElement.innerText = "Failed to fetch customer info";
        }
      } catch (err) {
        console.log("Request ID: " + err.requestID);
        console.log("error status: " + err.status);
        console.log("error message: " + err.message);
        textElement.innerText = "Failed to fetch customer info";
      }
    } else {
      textElement.innerText = "No contact data available";
    }
  }
  
  function handleErr(err) {
    console.error("App failed to initialize", err);
  }
  