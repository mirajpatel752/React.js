let apiEndpoint;
const hostname = window.location.hostname;
if (hostname === "localhost") {
  apiEndpoint = "https://stageapi.themunim.com/api";
}

module.exports = {
  apiEndpoint,
};
