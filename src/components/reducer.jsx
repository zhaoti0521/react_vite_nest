import {createStore} from 'redux';
const initstatre= {
  list:[{id:1}]
}

function reducer({state=initstatre,action}){
  switch(action.type){
    case 'a':
      return state+1;
    case 'b':
      return state-1;
    default:
      return '错误'
  }
}
const store =createStore(reducer);
export default store;


