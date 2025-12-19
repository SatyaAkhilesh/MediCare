import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';



function Addmedicine() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [company, setCompany] = useState('');

  const [crawling, setCrawling] = useState(false);
  const [quantity, setQuantity] = useState();

  const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const handleDialogueOpen = () => {
    setErrorDialogueBoxOpen(true)
  };
  const handleDialogueClose = () => {
    setErrorList([]);
    setErrorDialogueBoxOpen(false)
  };

  const crawlingMedicines = (event) => {
    event.preventDefault();
    setCrawling(true)
    fetch(`http://localhost:3001/medicines/crawling`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quantity
      })
    }).then(res => {
      navigate("/medicines");
    }).catch(err => {

    }).finally(() => {
      setCrawling(false)
    })
  }

  const addmedicine = (event) => {
    event.preventDefault();
    // TODO: Handle medicine form submission
    const form = document.forms.addmedicineForm;
    let medicine = {
      name: form.name.value,
      description: form.description.value,
      price: form.price.value,
      company: form.company.value
    }


    fetch('http://localhost:3001/medicines', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medicine)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let respMessage = data.message;
        if (respMessage === "success") {
          navigate("/medicines");
        }
        else {
          //Display error message
          setErrorList(data.errors);
          handleDialogueOpen();
        }
      });
  };



  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="page-wrapper">
        <div className="content">

          <div className="card-box">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h4 className="page-title">Add Medicine</h4>
              </div>
            </div>
            <div className="row">

              <div className="col-lg-8 offset-lg-2">
                <form id="addmedicineForm" name='addmedicineForm' onSubmit={addmedicine}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Brand <span className="text-danger">*</span></label>
                        <input name="company" className="form-control" type="text" required value={company} onChange={(event) => setCompany(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Medicine Name <span className="text-danger">*</span></label>
                        <input name="name" className="form-control" type="text" required value={name} onChange={(event) => setName(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Description</label>
                        <input name="description" className="form-control" type="text" value={description} onChange={(event) => setDescription(event.target.value)} />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Price <span className="text-danger">*</span></label>
                        <input name="price" className="form-control" type="number" required value={price} onChange={(event) => setPrice(event.target.value)} />
                      </div>
                    </div>

                  </div>

                  <div className="m-t-20 text-center">
                    <button id="addmedicine" type="submit" className="btn btn-primary submit-btn">Create medicine</button>
                  </div>
                </form>

                <form onSubmit={crawlingMedicines} className={'mt-5 align-items-center'}>

                  <div className="m-t-20  d-flex gap-2">
                    <input
                      required
                      value={quantity}
                      onChange={e => {
                        const newQuantity = Number(e.target.value);
                        if (newQuantity <= 0) {
                          setQuantity(1);
                        } else if (newQuantity > 99) {
                          setQuantity(99)
                        } else {
                          setQuantity(Math.floor(newQuantity))
                        }

                      }}
                      placeholder={'Enter medicines quantity to crawling'} type={'number'} className={'form-control w-25'} />
                    <button type="submit" className="btn btn-primary">Crawling</button>
                  </div>
                  {crawling && <p className={'mt-2'}>
                    <span className={'mb-0 text-success'}>Crawling...</span>
                  </p>}
                </form>
              </div>
            </div>
          </div>
        </div>
        <ErrorDialogueBox
          open={errorDialogueBoxOpen}
          handleToClose={handleDialogueClose}
          ErrorTitle="Error: Add Medicine"
          ErrorList={errorList}
        />
      </div>
    </Box>
  )
}

export default Addmedicine;
