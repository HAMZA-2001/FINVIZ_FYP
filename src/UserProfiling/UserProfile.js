import React from 'react'
import { Row, Col, Button, Form, Container } from 'react-bootstrap'
import profileImg from "./userIcon3.svg"

function UserProfile() {
  return (
    <div className='text-white grid grid-cols-1 gap-2 sm:grid-cols-2 pt-20'>
        <div className='text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
            <div className='base-container w-full flex flex-col items-center' >
            <div className='header text-white text-3xl font-sans w-96 mb-3'>User Profile</div>
            <div className='content flex flex-col w-96'>
                <div className='image w-96 flex justify-center'>
                    <img src={profileImg} className=" flex justify-center w-20 h-20"></img>
                </div>

                <div className='form mt-2 flex flex-col items-center w-96'>
                    <div className='form-group flex flex-col items-start w-fit'>
                        <label htmlFor='name' className='text-white text-lg'>Name</label>
                        <input type='text' name='email' placeholder='name' className='w-96 mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8 px-2 focus:outline-none rounded-lg text-black' />
                    </div>
                    <div className='form-group flex flex-col items-start w-fit'>
                        <label htmlFor='password' className='text-white text-lg'>Age</label>
                        <input type='password' name='password' placeholder='age' className='w-96 mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-cyan-800 mb-8 px-2 focus:outline-none rounded-lg text-black' />
                    </div>
                    <div className='form-group flex flex-col items-start  w-fit'>
                        <label htmlFor='password' className='text-white text-lg'>Income ($)</label>
                        <input type='number' name='income' placeholder='income' className='w-96 mt-1 w-72 h-9 font-sans text-sm bg-slate-100 rounded ease-in duration-300 focus:outline-none focus:shadow-xl mb-8 w-full px-2 focus:outline-none rounded-lg text-black' />
                    </div>
                </div>
                <div className='footer mt-3'>
                    <button type="submit" className='btn text-white bg-sky-900 text-lg pt-1 pb-1 pr-2 pl-2 rounded hover:bg-blue-700 focus:outline-none '  >
                        Update
                    </button>
                </div>

            </div>
            </div>     
        </div>
        <div className='text-white bg-neutral-900 rounded-lg shadow-xl min-h-[50px] flex justify-center align-center'>
            hey
        </div>
    </div>
  )
}

export default UserProfile


// <Container>
// <Row className='profileContainer'>
//     <Col md={6}>
//         Form
//     </Col>
//     <Col>Profile Pic</Col>
// </Row>
// </Container>