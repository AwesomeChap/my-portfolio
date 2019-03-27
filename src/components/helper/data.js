export const set1 = [
  {
    name : 'React',
    value : '85'
  },
  {
    name : 'Redux',
    value : '75'
  },
  {
    name : 'CSS',
    value : '95'
  },{
    name : 'UX',
    value : '75'
  },
  {
    name : 'UI',
    value : '85'
  },
  {
    name : 'CorelDRAW',
    value : '80'
  }
];

export const set2 = [
  {
    name : 'Node',
    value : '80'
  },
  {
    name : 'MongoDB',
    value : '75'
  },
  {
    name : 'GraphQL',
    value : '75'
  },{
    name : 'C++',
    value : '85'
  },
  {
    name : 'NASM',
    value : '60'
  },
  {
    name : 'Linux',
    value : '70'
  }
];

export const keywords = ['Show All','Web','React','CSS', 'SCSS', 'SVG', 'Animations', 'Node', 'Web Sockets', 'MongoDB', 'GraphQL', 'Mobile', 'ReactNative', 'C++', 'NASM'];

import roomChatImg from '../../images/chat.PNG';
import superMarketImg from '../../images/sp.png';
import orderMeImg from '../../images/order_me.PNG';
import timeTrackerImg from '../../images/time-tracker.PNG';
import PiecesImage from '../../images/10_pieces.PNG';
import chemAssisImage from '../../images/chem_assis.png';

export const projects = [
  {
    name : 'Portfolio',
    imgUrl:'',
    keywords : ['Web', 'React', 'SCSS', 'SVG', 'Animations', 'Node'],
    link : '',
    gitUrl : '',
    desc : ''
  },
  {
    name : 'Blog',
    imgUrl : '',
    keywords : ['Web', 'React', 'SCSS', 'SVG', 'Animations', 'Node'],
    link : '',
    gitUrl : '',
    desc : ''
  },
  {
    name : 'Room_Chat',
    imgUrl : roomChatImg,
    keywords : ['Web', 'CSS', 'Node', 'Web Sockets'],
    link: 'https://room-chatx.herokuapp.com/',
    gitUrl : 'https://github.com/AwesomeChap/Room_Chat',
    desc : "A Chat App build to provide room like experience to group of people while conversing with each other"
  },
  {
    name : 'Time Tracker',    
    imgUrl : timeTrackerImg,                                        
    keywords : ['Web', 'SCSS', 'Node', 'React', 'MongoDB'],
    link: 'https://mern-time-tracker.herokuapp.com',
    gitUrl : 'https://github.com/AwesomeChap/MERN-Time-Tracker',
    desc : "A Time Tracking App demonstrating full CRUD functionality using MERN stack"
  },
  {
    name : 'SuperMarket FoodInfo',
    imgUrl : superMarketImg,
    keywords : ['Web', 'SCSS', 'Node', 'React', 'MongoDB'],
    link: 'https://supermarket-foodinfo.herokuapp.com/',
    gitUrl : 'https://github.com/AwesomeChap/supermarket',
    desc : "A WebApp that let's you see important details of selected food items and then compare it's with others"
  },
  {
    name : '10_Pieces',
    imgUrl : PiecesImage,
    keywords : ['Web', 'CSS'],
    link: 'https://awesomechap.github.io/10-Pieces/.',
    gitUrl : 'https://github.com/AwesomeChap/10-Pieces',
    desc : "A web demonstration showing power of pure CSS"
  },
  {
    name : 'Chem Assis',
    imgUrl : chemAssisImage,
    keywords : ['C++'],
    link: '',
    gitUrl : 'https://github.com/AwesomeChap/chem_assistant',
    desc : "A C++ program helping in saving elements and then if you wish you can search, modify or even delete them"
  },
  {
    name : 'Order Me',
    imgUrl : orderMeImg,
    keywords : ['NASM'],
    link: '',
    gitUrl : 'https://github.com/AwesomeChap/Order_me',
    desc : "An application made using assembly language, converting blank file to ordered sentences"
  }
]