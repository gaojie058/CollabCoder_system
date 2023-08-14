const fs = require('fs');
const { parse } = require('csv-parse');

// Read the CSV file

async function split_into_cells(fileData) {
    return new Promise((resolve, reject) => {
      parse(fileData, { delimiter: '\n' }, (err, lines) => {
        if (err) return reject(err);
  
        const segmented_data = lines.map(line => line[0]);
  
        resolve(segmented_data);
      });
    });
  }

module.exports.split_into_cells = split_into_cells


