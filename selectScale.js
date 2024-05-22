const rangeButtonElement = document.querySelector(".buttons");
const year_5RangeButton = rangeButtonElement.querySelector(".year5");
const year_1RangeButton = rangeButtonElement.querySelector(".year1");
const month_3RangeButton = rangeButtonElement.querySelector(".month3");
const month_1RangeButton = rangeButtonElement.querySelector(".month1");

function selectRangeFunction(companyName) {
  year_5RangeButton.addEventListener("click", () => {
    extractData(companyName, "5y").then((response) => {
      drawChart(response);
    });
  });

  year_1RangeButton.addEventListener("click", () => {
    extractData(companyName, "1y").then((response) => {
      drawChart(response);
    });
  });

  month_3RangeButton.addEventListener("click", () => {
    extractData(companyName, "3mo").then((response) => {
      drawChart(response);
    });
  });

  month_1RangeButton.addEventListener("click", () => {
    extractData(companyName, "1mo").then((response) => {
      drawChart(response);
    });
  });
}
