const hocc = (wrap) => {
  return React.forwardRef((props,ref) => {
    return <wrap
    {...props}
    ref={ref}/>
  })

}









const withCom = (WrapCom) => {
  const didMount = WrapCom.prototype.componentDidMount;
  return class Hoc extends WrapCom{
    async componentDidMount(){
      if(didMount){
        await didMount.apply(this);
      }
      this.setState({name: 'zz'})
    }
    render(){
      return super.render();
    }
  }
}









// const { useState } = require("react")

// const withhoc = (wrapCom) => {
//   return (props) => {
//     const [inputVlue,setInputVlue] = useState(0);
//     const handlechange=()=>{
//       setInputVlue(e.target.value);
//     }
//     return <wrapCom
//     inputVlue={inputVlue}
//     handlechange={handlechange}/>
//   }
// }

// const myCom = ({handlechange,inputVlue}) => {
//   return <>
//   <input type="text" value={inputVlue} onChange={handlechange}/>
//   </>
// }

// const enCom = withhoc(myCom);
// export default enCom;
