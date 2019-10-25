 const cleanName = name => {
    /* const scandies = ['/ä/g','/Ä/g','/ö/g','/Ö/g','/å/g','/Å/g']
    const nonScandies = ['a','A','o','O','å','Å']
    nonScandies.forEach((char,i) => name.replace(scandies[i], char)) */
    ;['a', 'A', 'o', 'O', 'å', 'Å'].forEach((char, i) =>
      name.replace(['/ä/g', '/Ä/g', '/ö/g', '/Ö/g', '/å/g', '/Å/g'][i], char)
    )
    name = name
      .replace(/€/g, 'e ')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/ /gi, '_')
    return name
  }
 
  export default cleanName