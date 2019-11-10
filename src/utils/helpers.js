const cleanName = name => {
  const scandies = ['/ä/g', '/Ä/g', '/ö/g', '/Ö/g', '/å/g', '/Å/g']
  const nonScandies = ['a', 'A', 'o', 'O', 'a', 'A']
  scandies.forEach((scandy, i) => name.replace(scandy, nonScandies[i]))
  return name
    .replace(/€/g, 'e ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/ /gi, '_')
}

const cleanFile = text => {
  const uploadedRows = text
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¤/g, 'ä')
    .split('\n')
  const delimiter =
    uploadedRows[0].split(';').length > uploadedRows[0].split(',').length
      ? ';'
      : ','
  const CSVrows = uploadedRows.map(row => row.trim().split(delimiter))
  let cleanerCSV = CSVrows.filter(row => row.length > 1)
  while (true) {
    let lastCol = cleanerCSV[0][cleanerCSV[0].length - 1]
    if (lastCol === '' || lastCol.length < 2) {
      cleanerCSV = cleanerCSV.map(row => {
        let rowToPop = row
        rowToPop.pop()
        return rowToPop
      })
    } else {
      break
    }
  }
  return cleanerCSV
}

export { cleanName, cleanFile }
