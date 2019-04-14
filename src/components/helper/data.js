export const set1 = [
  {
    name : 'React',
    value : '80'
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


export const works = [
  {
    place : "INFOX, Techspace USICT",
    date : "Sep,1 2018 - Oct,26 2018",
    link : "https://github.com/techspaceusict/infox18",
    designation : "Lead Frontend Developer",
    rspbs : [
      "Created robust UI",
      "Wrote almost everything from scratch",
      "Designed icons",
      "Managed working of frontend with Backend",
      "Work in multidisciplinary team"
    ]
  },
  {
    place : "Web Masters, Techspace USICT",
    date : "Oct,28 2018",
    link : "",
    designation : "Organiser & Co-Judge",
    rspbs : [
      "Monitered Progress of participants",
      "Provided Guidence in Pre-event discussion",
      "Judged considering all equal"
    ]
  },
  {
    place : "Delhipreneurs",
    date : "July,1 2018 - Dec,15 2018",
    link : "",
    designation : "Web Developer",
    rspbs : [
      "Wrote vareity ofJQuery and CSS animations",
      "improved previous base template",
      "Designed logo",
      "Connected Frontend and Backend"
    ]
  }
]

export const keywords = ['Show All','Web','React','CSS', 'SCSS', 'SVG', 'Animations', 'Node','SEO','Web Sockets', 'MongoDB', 'GraphQL', 'Mobile', 'ReactNative', 'C++', 'NASM'];

import roomChatImg from '../../images/chat.PNG';
import superMarketImg from '../../images/sp.png';
import orderMeImg from '../../images/order_me.PNG';
import timeTrackerImg from '../../images/time-tracker.PNG';
import PiecesImage from '../../images/10_pieces.PNG';
import chemAssisImage from '../../images/chem_assis.png';
import sample from '../../images/sample.PNG';
import portfolio from '../../images/portfolio.PNG';
import tcp from '../../images/tcp.png';

export const projects = [
  {
    name : 'Portfolio',
    imgUrl: portfolio,
    keywords : ['Web', 'React', 'SCSS', 'SVG', 'Animations', 'Node', 'SEO'],
    link : 'http://www.jatinkumar.tech/',
    gitUrl : '',
    desc : 'This is My portfolio website'
  },
  // {
  //   name : 'Blog',
  //   imgUrl : sample,
  //   keywords : ['Web', 'React', 'SCSS', 'SVG', 'Animations', 'Node'],
  //   link : '',
  //   gitUrl : '',
  //   desc : 'This is my blog'
  // },
  {
    name : 'SuperMarket FoodInfo',
    imgUrl : superMarketImg,
    keywords : ['Web', 'SCSS', 'Node', 'React', 'MongoDB'],
    link: 'https://supermarket-foodinfo.herokuapp.com/',
    gitUrl : 'https://github.com/AwesomeChap/supermarket',
    desc : "A WebApp that let's you see important details of selected food items and then compare it's with others"
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
    name : 'Room_Chat',
    imgUrl : roomChatImg,
    keywords : ['Web', 'CSS', 'Node', 'Web Sockets'],
    link: 'https://room-chatx.herokuapp.com/',
    gitUrl : 'https://github.com/AwesomeChap/Room_Chat',
    desc : "A Chat App build to provide room like experience to group of people"
  },
  {
    name : '10_Pieces',
    imgUrl : PiecesImage,
    keywords : ['Web', 'CSS', 'Animations'],
    link: 'https://awesomechap.github.io/10-Pieces/.',
    gitUrl : 'https://github.com/AwesomeChap/10-Pieces',
    desc : "A web demonstration to show power of pure CSS"
  },
  {
    name : 'TCP Server',
    imgUrl : tcp,
    keywords : ['C++', 'Web Sockets'],
    link: '',
    gitUrl : 'https://github.com/AwesomeChap/TCP_CLient_Server',
    desc : "A TCP server made using C++ utilising Web Sockets"
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
