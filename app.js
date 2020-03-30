const express = require('express');
const axios = require('axios');
const {JSDOM} = require('jsdom');
const path = require('path');

class App {
  constructor(port = 8080) {
    this.appPort = port;
    this.expressApp = express();
    this.bindRoutes();
    this.countriesList = null;
    this.countriesData = [];
  }

  bindRoutes() {
    this.expressApp.use('/assets', express.static(path.resolve(__dirname, './client/dist')));

    this.expressApp.get('/',  (req, res) => {
      res.sendFile(path.resolve(__dirname, './client/dist/index.html'));
    });

    this.expressApp.get('/api/get-countries-list', (request, response) => {
      this.getCountriesList()
        .then(countriesList => {
          this.countriesList = countriesList;
          response.send(JSON.stringify(countriesList));
        });
    });

    this.expressApp.get('/api/get-countries-data', (request, response) => {
      const requestedCountries = request.query.countries ? request.query.countries.split(',') : [];

      if (requestedCountries.length) {
        this.getCountriesData(requestedCountries)
          .then(countriesData => {
            response.send(JSON.stringify(countriesData));
          });
      } else {
        response.send(JSON.stringify('[]'));
      }
    });
  }

  getCountriesList() {
    return new Promise((resolve, reject) => {
      if (this.countriesList) {
        resolve(this.countriesList);
      } else {
        return axios.get('https://www.worldometers.info/coronavirus/')
          .then(response => {
            const {document} = new JSDOM(response.data).window;
            const countriesLinks = document.querySelectorAll('#main_table_countries_today tbody tr td:first-child a');

            this.countriesList = Array.from(countriesLinks).map(countryLink => {
              return {
                id: countryLink.textContent.toLowerCase(),
                name: countryLink.textContent,
                url: `https://www.worldometers.info/coronavirus/${countryLink.href}`
              };
            }).sort((country1, country2) => {
              if (country1.name < country2.name) { return -1; }
              if (country1.name > country2.name) { return 1; }
              return 0;
            })

            resolve(this.countriesList);
          });
      }
    });
  }

  getCountriesData(countries = []) {
    return new Promise((resolve, reject) => {
      this.getCountriesList()
        .then(countriesList => {
          const countriesData = [];
          const validCountries = [];
          const countriesToRequest = [];

          for (let i = 0; i < countries.length; i++) {
            const country = countriesList.find(country => country.id === countries[i].toLowerCase());

            if (country) {
              validCountries.push(country);
            }
          }

          for (let i = 0; i < validCountries.length; i++) {
            const countryData = this.countriesData.find(country => country.id === validCountries[i].id);
            if (countryData) {
              countriesData.push = countryData;
            } else {
              countriesToRequest.push(validCountries[i]);
            }
          }

          return Promise.all(countriesToRequest.map(country => this.getCountryData(country)));
        })
        .then(data => {
          resolve(data);
        })
      });
  }

  getCountryData(country) {
    return new Promise((resolve, reject) => {
      axios.get(country.url)
        .then(response => {
          const {document} = new JSDOM(response.data).window;
          const scripts = document.querySelectorAll('script');

          const countryData = Array.from(scripts).filter(script => {
            return typeof script.textContent === 'string' && script.textContent.trim() !== ''
          }).map(script => {
            return script.textContent.replace(/\n|\s{2,}/gs, '');
          }).filter(scriptString => {
            return scriptString.match(/graph-active-cases-total|coronavirus-cases-linear/g);
          }).map(filteredScriptString => {
            const data = [];
            const datesString = filteredScriptString.match(/xAxis:\s?{\s?categories:\s?\[(.*?)\s?\]\s?}/);

            if (datesString && datesString.length > 0 && datesString[1]) {
              const dates = datesString[1].trim().split(',').map(date => {
                return `${date} 2020`.replace(/\"/g, '');
              });

              const countsString = filteredScriptString.match(/data:\s?\[\s?(.*?)\s?]/);

              if (countsString && countsString.length && countsString[1]) {
                const counts = countsString[1].trim().split(',').map(count => {
                  return Number(count);
                });

                if (counts.length === dates.length) {
                  const partialData = {
                    type: filteredScriptString.match(/graph-active-cases-total/) ? 'active' : 'total',
                    data: []
                  };

                  let allFirstZeroCasesDaysRemoved = false;

                  for (let i = 0; i < counts.length; i++) {
                    if (counts[i] > 0 && !allFirstZeroCasesDaysRemoved) {
                      allFirstZeroCasesDaysRemoved = true;
                    }

                    if (allFirstZeroCasesDaysRemoved) {
                      partialData.data.push({
                        date: dates[i],
                        cases: counts[i]
                      });
                    }
                  }

                  return partialData;
                }
              }
            }
          }).reduce((data, partial) => {
            data[partial.type] = [
              ...partial.data
            ];

            return data;
          }, {});

          resolve({
            id: country.id,
            name: country.name,
            data: countryData
          });
        });
    });
  }

  start() {
    this.expressApp.listen(this.appPort, () => {console.log('App started!')});
  }
}

const app = new App();
app.start();
