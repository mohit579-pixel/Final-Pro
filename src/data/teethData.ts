interface ToothPosition {
  id: string;
  x: number;
  y: number;
  path: string;
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
  jaw: 'upper' | 'lower';
  side: 'left' | 'right';
}

// Define all teeth positions for a complete dental chart using a more realistic arch shape
export const teethData: ToothPosition[] = [
  // Upper Right (1-8) - Maxillary right side
  { 
    id: '1', 
    x: 330, 
    y: 55, 
    type: 'molar',
    jaw: 'upper',
    side: 'right',
    path: 'M325,45 C332,45 337,48 337,55 C337,62 332,65 325,65 C318,65 313,62 313,55 C313,48 318,45 325,45 Z' 
  },
  { 
    id: '2', 
    x: 305, 
    y: 45, 
    type: 'molar',
    jaw: 'upper',
    side: 'right',
    path: 'M300,35 C307,35 312,38 312,45 C312,52 307,55 300,55 C293,55 288,52 288,45 C288,38 293,35 300,35 Z' 
  },
  { 
    id: '3', 
    x: 280, 
    y: 35, 
    type: 'premolar',
    jaw: 'upper',
    side: 'right',
    path: 'M275,27 C281,27 285,30 285,37 C285,44 281,47 275,47 C269,47 265,44 265,37 C265,30 269,27 275,27 Z' 
  },
  { 
    id: '4', 
    x: 255, 
    y: 30, 
    type: 'premolar',
    jaw: 'upper',
    side: 'right',
    path: 'M250,22 C256,22 260,25 260,32 C260,39 256,42 250,42 C244,42 240,39 240,32 C240,25 244,22 250,22 Z' 
  },
  { 
    id: '5', 
    x: 230, 
    y: 25, 
    type: 'canine',
    jaw: 'upper',
    side: 'right',
    path: 'M225,17 C231,17 235,20 235,27 C235,34 231,37 225,37 C219,37 215,34 215,27 C215,20 219,17 225,17 Z' 
  },
  { 
    id: '6', 
    x: 205, 
    y: 22, 
    type: 'incisor',
    jaw: 'upper',
    side: 'right',
    path: 'M200,15 C205,15 210,17 210,25 C210,33 205,35 200,35 C195,35 190,33 190,25 C190,17 195,15 200,15 Z' 
  },
  { 
    id: '7', 
    x: 182, 
    y: 20, 
    type: 'incisor',
    jaw: 'upper',
    side: 'right',
    path: 'M177,13 C182,13 187,15 187,23 C187,31 182,33 177,33 C172,33 167,31 167,23 C167,15 172,13 177,13 Z' 
  },
  { 
    id: '8', 
    x: 162, 
    y: 20, 
    type: 'incisor',
    jaw: 'upper',
    side: 'right',
    path: 'M157,13 C162,13 167,15 167,23 C167,31 162,33 157,33 C152,33 147,31 147,23 C147,15 152,13 157,13 Z' 
  },

  // Upper Left (9-16) - Maxillary left side
  { 
    id: '9', 
    x: 142, 
    y: 20, 
    type: 'incisor',
    jaw: 'upper',
    side: 'left',
    path: 'M137,13 C142,13 147,15 147,23 C147,31 142,33 137,33 C132,33 127,31 127,23 C127,15 132,13 137,13 Z' 
  },
  { 
    id: '10', 
    x: 122, 
    y: 22, 
    type: 'incisor',
    jaw: 'upper',
    side: 'left',
    path: 'M117,15 C122,15 127,17 127,25 C127,33 122,35 117,35 C112,35 107,33 107,25 C107,17 112,15 117,15 Z' 
  },
  { 
    id: '11', 
    x: 99, 
    y: 25, 
    type: 'canine',
    jaw: 'upper',
    side: 'left',
    path: 'M94,17 C100,17 104,20 104,27 C104,34 100,37 94,37 C88,37 84,34 84,27 C84,20 88,17 94,17 Z' 
  },
  { 
    id: '12', 
    x: 75, 
    y: 30, 
    type: 'premolar',
    jaw: 'upper',
    side: 'left',
    path: 'M70,22 C76,22 80,25 80,32 C80,39 76,42 70,42 C64,42 60,39 60,32 C60,25 64,22 70,22 Z' 
  },
  { 
    id: '13', 
    x: 52, 
    y: 35, 
    type: 'premolar',
    jaw: 'upper',
    side: 'left',
    path: 'M47,27 C53,27 57,30 57,37 C57,44 53,47 47,47 C41,47 37,44 37,37 C37,30 41,27 47,27 Z' 
  },
  { 
    id: '14', 
    x: 30, 
    y: 45, 
    type: 'molar',
    jaw: 'upper',
    side: 'left',
    path: 'M25,35 C32,35 37,38 37,45 C37,52 32,55 25,55 C18,55 13,52 13,45 C13,38 18,35 25,35 Z' 
  },
  { 
    id: '15', 
    x: 12, 
    y: 55, 
    type: 'molar',
    jaw: 'upper',
    side: 'left',
    path: 'M7,45 C14,45 19,48 19,55 C19,62 14,65 7,65 C0,65 -5,62 -5,55 C-5,48 0,45 7,45 Z' 
  },
  { 
    id: '16', 
    x: 15, 
    y: 80, 
    type: 'molar',
    jaw: 'upper',
    side: 'left',
    path: 'M10,70 C17,70 22,73 22,80 C22,87 17,90 10,90 C3,90 -2,87 -2,80 C-2,73 3,70 10,70 Z' 
  },

  // Lower Left (17-24) - Mandibular left side
  { 
    id: '17', 
    x: 15, 
    y: 160, 
    type: 'molar',
    jaw: 'lower',
    side: 'left',
    path: 'M10,150 C17,150 22,153 22,160 C22,167 17,170 10,170 C3,170 -2,167 -2,160 C-2,153 3,150 10,150 Z' 
  },
  { 
    id: '18', 
    x: 30, 
    y: 172, 
    type: 'molar',
    jaw: 'lower',
    side: 'left',
    path: 'M25,162 C32,162 37,165 37,172 C37,179 32,182 25,182 C18,182 13,179 13,172 C13,165 18,162 25,162 Z' 
  },
  { 
    id: '19', 
    x: 52, 
    y: 182, 
    type: 'premolar',
    jaw: 'lower',
    side: 'left',
    path: 'M47,174 C53,174 57,177 57,184 C57,191 53,194 47,194 C41,194 37,191 37,184 C37,177 41,174 47,174 Z' 
  },
  { 
    id: '20', 
    x: 75, 
    y: 188, 
    type: 'premolar',
    jaw: 'lower',
    side: 'left',
    path: 'M70,180 C76,180 80,183 80,190 C80,197 76,200 70,200 C64,200 60,197 60,190 C60,183 64,180 70,180 Z' 
  },
  { 
    id: '21', 
    x: 99, 
    y: 192, 
    type: 'canine',
    jaw: 'lower',
    side: 'left',
    path: 'M94,184 C100,184 104,187 104,194 C104,201 100,204 94,204 C88,204 84,201 84,194 C84,187 88,184 94,184 Z' 
  },
  { 
    id: '22', 
    x: 122, 
    y: 194, 
    type: 'incisor',
    jaw: 'lower',
    side: 'left',
    path: 'M117,186 C122,186 127,188 127,196 C127,204 122,206 117,206 C112,206 107,204 107,196 C107,188 112,186 117,186 Z' 
  },
  { 
    id: '23', 
    x: 142, 
    y: 195, 
    type: 'incisor',
    jaw: 'lower',
    side: 'left',
    path: 'M137,187 C142,187 147,189 147,197 C147,205 142,207 137,207 C132,207 127,205 127,197 C127,189 132,187 137,187 Z' 
  },
  { 
    id: '24', 
    x: 162, 
    y: 195, 
    type: 'incisor',
    jaw: 'lower',
    side: 'left',
    path: 'M157,187 C162,187 167,189 167,197 C167,205 162,207 157,207 C152,207 147,205 147,197 C147,189 152,187 157,187 Z' 
  },

  // Lower Right (25-32) - Mandibular right side
  { 
    id: '25', 
    x: 182, 
    y: 195, 
    type: 'incisor',
    jaw: 'lower',
    side: 'right',
    path: 'M177,187 C182,187 187,189 187,197 C187,205 182,207 177,207 C172,207 167,205 167,197 C167,189 172,187 177,187 Z' 
  },
  { 
    id: '26', 
    x: 205, 
    y: 194, 
    type: 'incisor',
    jaw: 'lower',
    side: 'right',
    path: 'M200,186 C205,186 210,188 210,196 C210,204 205,206 200,206 C195,206 190,204 190,196 C190,188 195,186 200,186 Z' 
  },
  { 
    id: '27', 
    x: 230, 
    y: 192, 
    type: 'canine',
    jaw: 'lower',
    side: 'right',
    path: 'M225,184 C231,184 235,187 235,194 C235,201 231,204 225,204 C219,204 215,201 215,194 C215,187 219,184 225,184 Z' 
  },
  { 
    id: '28', 
    x: 255, 
    y: 188, 
    type: 'premolar',
    jaw: 'lower',
    side: 'right',
    path: 'M250,180 C256,180 260,183 260,190 C260,197 256,200 250,200 C244,200 240,197 240,190 C240,183 244,180 250,180 Z' 
  },
  { 
    id: '29', 
    x: 280, 
    y: 182, 
    type: 'premolar',
    jaw: 'lower',
    side: 'right',
    path: 'M275,174 C281,174 285,177 285,184 C285,191 281,194 275,194 C269,194 265,191 265,184 C265,177 269,174 275,174 Z' 
  },
  { 
    id: '30', 
    x: 305, 
    y: 172, 
    type: 'molar',
    jaw: 'lower',
    side: 'right',
    path: 'M300,162 C307,162 312,165 312,172 C312,179 307,182 300,182 C293,182 288,179 288,172 C288,165 293,162 300,162 Z' 
  },
  { 
    id: '31', 
    x: 330, 
    y: 160, 
    type: 'molar',
    jaw: 'lower',
    side: 'right',
    path: 'M325,150 C332,150 337,153 337,160 C337,167 332,170 325,170 C318,170 313,167 313,160 C313,153 318,150 325,150 Z' 
  },
  { 
    id: '32', 
    x: 325, 
    y: 135, 
    type: 'molar',
    jaw: 'lower',
    side: 'right',
    path: 'M320,125 C327,125 332,128 332,135 C332,142 327,145 320,145 C313,145 308,142 308,135 C308,128 313,125 320,125 Z' 
  }
];

export const commonDentalConditions = [
  'Warna',
  'Sariawan',
  'Karias',
  'Kanker',
  'Kalkulus',
  'Hipodonia',
  'Gingivitus',
]; 