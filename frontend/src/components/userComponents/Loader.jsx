import { Spinner } from "react-bootstrap"
function Loader() {
  return (
    <Spinner
        animation="border"
        role= 'status'
        style= {{
            width : '50px',
            height : '50px',
            margin : 'auto',
            display : 'block',
            color: 'red'
        }}
    >

    </Spinner>
  )
}

export default Loader
