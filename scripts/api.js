document.getElementById("fetchDataBtn").addEventListener("click", function() {
  fetch("https://api-listfilm.vercel.app/") // URL API
      .then(response => response.json()) // Ubah ke JSON
      .then(data => {
          let productHTML = "";
          data.forEach(product => {
              productHTML += `
                  <div class="col-md-4">
                      <div class="card shadow-lg p-3 mb-5 bg-white rounded-lg">
                          <img src="${product.image}" class="card-img-top rounded" alt="${product.title}" style="height: 250px; object-fit: contain;">
                          <div class="card-body text-center">
                              <h5 class="card-title text-lg font-semibold">${product.title}</h5>
                              <p class="card-text text-gray-700">Rp ${product.price.toLocaleString()}</p>
                              <button class="btn btn-success">Beli</button>
                          </div>
                      </div>
                  </div>
              `;
          });
          document.getElementById("products").innerHTML = productHTML;
      })
      .catch(error => console.error("Error:", error));
});
