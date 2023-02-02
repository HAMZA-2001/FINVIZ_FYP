import React from 'react'
import {Form, Button, Card} from 'react-bootstrap'
import { useRef } from 'react'

function Signup1() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmlRef = useRef()

  return (
    <div>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'></h2>
          <Form>
            <Form.Group id="email">
              <Form.Label className='text-white'>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label className='text-white'>Password</Form.Label>
              <Form.Control type="email" ref={passwordRef} required/>
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label className='text-white'>Password Confirmation</Form.Label>
              <Form.Control type="email" ref={passwordConfirmlRef} required/>
            </Form.Group>
            <Button className='w-100 text-white' type="submit">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2 c-'>
        Already have an account
      </div>
    </div>

  )
}

export default Signup1


// <div className='flex h-screen justify-center place-items-center'>
// <div className='h-3/4 w-1/4'>
//   <Card>
//       <div className='flex flex-col '>

//           <h5 className='text-center'>Sign Up</h5>

//           <div>
//           <h1>Sign-in</h1>
//             <form>
//               <h5>E-mail</h5>
//               <input type='text'></input>
//             </form>
//           </div>

         
//       </div>
//   </Card>
// </div>
// </div>