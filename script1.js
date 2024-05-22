const bookValueElement = document.querySelector(".bookValue");
const profitValueElement = document.querySelector(".profitValue");
const stockDetailsElement = document.querySelector(".stockDetails");
const companyNameElement = stockDetailsElement.querySelector(".companyName");
const summaryElement = document.querySelector(".summary");
const companyListElement = document.querySelector(".companyList");
const companyULElement = companyListElement.querySelector("ul");

function addBookValue(companyShortName) {
  const bookValueRequest = fetch(
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const stocksData = data.stocksStatsData[0];
      const companyName = companyShortName;

      const stockDetails = stocksData[companyName];
      const bookValue = stockDetails.bookValue;
      const profitValue = stockDetails.profit;

      companyNameElement.textContent = companyName;
      bookValueElement.textContent = "$" + bookValue;
      profitValueElement.textContent = profitValue + "%";

      if (profitValue > 0) {
        profitValueElement.style.color = "#0de014";
      } else {
        profitValueElement.style.color = "#E0230d";
      }
      console.log(stockDetails);
    });
}

function addSummary(companyShortName) {
  const summaryRequest = fetch(
    "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const stocksSummary = response.stocksProfileData[0];
      const companyName = companyShortName;
      const selectedCompanySummary = stocksSummary[companyName].summary;
      summaryElement.textContent = selectedCompanySummary;
    });
}

function addCompanysToList() {
  const listRequest = fetch(
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const stocksDetails = response.stocksStatsData[0];
      const companies = Object.entries(stocksDetails).map(([name, data]) => ({
        name,
        ...data,
      }));

      for (let company of companies) {
        if (company.name === "_id") continue;

        const listElement = document.createElement("li");
        const divElement = document.createElement("div");
        divElement.className = "selectCompany";

        const companyName = company.name;

        const buttonElement = document.createElement("button");
        buttonElement.textContent = companyName;

        const spanBookValueElement = document.createElement("span");
        spanBookValueElement.textContent =
          "$" + parseFloat(company.bookValue).toFixed(3);

        const spanProfitValueElement = document.createElement("span");
        spanProfitValueElement.textContent =
          parseFloat(company.profit).toFixed(2) + "%";

        if (company.profit > 0) {
          spanProfitValueElement.style.color = "#0de014";
        } else {
          spanProfitValueElement.style.color = "#E0230d";
        }

        divElement.appendChild(buttonElement);
        divElement.appendChild(spanBookValueElement);
        divElement.appendChild(spanProfitValueElement);
        listElement.appendChild(divElement);
        companyULElement.appendChild(listElement);

        buttonElement.addEventListener("click", function (event) {
          console.log(event);
          addBookValue(companyName);
          addSummary(companyName);

          extractData(companyName, "5y").then((response) => {
            drawChart(response);
          });

          rangeButtonElement.style.opacity = 1;
          selectRangeFunction(companyName);
        });
      }
    });
}
addCompanysToList();
