const cleanName = name => {
  /* const scandies = ['/ä/g','/Ä/g','/ö/g','/Ö/g','/å/g','/Å/g']
    const nonScandies = ['a','A','o','O','å','Å']
    nonScandies.forEach((char,i) => name.replace(scandies[i], char)) */
  ;['a', 'A', 'o', 'O', 'å', 'Å'].forEach((char, i) =>
    name.replace(['/ä/g', '/Ä/g', '/ö/g', '/Ö/g', '/å/g', '/Å/g'][i], char)
  )
  return name
    .replace(/€/g, 'e ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/ /gi, '_')
}

export const cleanFile = text => {
  text = text.replace(/Ã¤/g, 'ä')
  text = text.replace(/Ã¶/g, 'ö')
  const uploadedRows = text.split('\n')
  const delimiter =
    uploadedRows[0].split(';').length > uploadedRows[0].split(',').length
      ? ';'
      : ','
  let CSVrows = []
  uploadedRows.forEach(row => CSVrows.push(row.trim().split(delimiter)))

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

export default cleanName
