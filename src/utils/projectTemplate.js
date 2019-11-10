export const projectTemplates = [
  {
    title: 'Minne rakennettaisiin pilvenpiirtäjä?',
    story: 'Järvenpäälle uusi sydän',
    districts: ['Keskusta', 'Kyrölä'],
    show:true,
    meters: [
      {
        title: 'Myytyjen asuntojen keskimääräinen neliöhinta vuoden sisällä',
        table: 'AsuntojenMyyntihinnatVuodenSisaan',
        col: 'VelatonNelihinta',
        unit: '€',
        importance: 1, 
        show: false,
      },
      {
        title: 'Myytyjen asuntojen kunto vuoden sisällä',
        table: 'AsuntojenMyyntihinnatVuodenSisaan',
        col: 'Kunto',
        unit: '',
        importance: 1, 
        points: ['huono', 'tyyd.', 'hyvä'], 
        show: false,
      },
       
    ],
  },
] 