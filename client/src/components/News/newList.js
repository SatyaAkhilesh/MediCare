import styles from '../dashboard/Dashboard.module.css';
import { React, useState, useEffect, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai"
import axios from 'axios';
import { Box, Modal } from '@mui/material';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 0,
    padding: '30px 0'
};
export default () => {
    const [news, setNews] = useState([]);
    const [open, setOpen] = useState(false);
    const [newContent, setNew] = useState({})
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [flag, setFlag] = useState(true)
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setContent('')
        setTitle('')
    };
    const getNews = () => {
        axios.get('http://localhost:3001/news').then(res => {
            // console.log(res.data.data)
            setNews(res.data.data.map(v => {
                return v;
            }))

        })
    }
    const del = () => {
        axios.post('http://127.0.0.1:3001/delnews', { id: newContent._id }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            // console.log(res)
            getNews()
            handleClose()
        })
    }
    const submit = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:3001/news', { title, content }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            // console.log(res)
            getNews()
            handleClose()
        })
    }
    useEffect(() => { getNews() }, [])
    return <Box component="main" style={{ backgroundColor: "#f5f5f5" }} sx={{ flexGrow: 1, p: 3 }} className={styles.news}>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box sx={style}>
                <AiOutlineClose onClick={handleClose} style={{ float: 'right', margin: "-10px 10px 0 0", cursor: "pointer" }}></AiOutlineClose>
                {flag ? <div><h4 style={{ textAlign: 'center' }}>{newContent.title}</h4>
                    <div style={{ padding: '10px' }}>{newContent.content}</div>
                    <div className='col-12' style={{ textAlign: "center", marginTop: '20px' }}>
                        <button onClick={() => del()} style={{ backgroundColor: "red", color: '#fff', border: '1px solid #377e22', width: '150px', borderRadius: "5px" }}>Delete</button>
                    </div>
                </div> : <form onSubmit={(e) => submit(e)} style={{ margin: "0 auto" }} className="col-10" name="loginForm" id="loginForm">
                    <h4 style={{ textAlign: 'center' }}>addNews</h4>
                    <div className='form-floating mt-3 col-12 mx-2'>
                        <input
                            id="email"
                            name="title"
                            placeholder="name@example.com"
                            value={title}
                            required
                            onChange={(e) => { setTitle(e.target.value) }}
                            className="form-control"
                        >
                        </input>
                        <label htmlFor="News Title" >News Title</label>
                    </div>

                    <div className=' mt-4 col-12 mx-2'>
                        <label htmlFor="Content">Content</label>
                        <input
                            type="textarea"
                            id="password"
                            name="Content"
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Content"
                        />
                    </div>
                    <div className='col-12' style={{ textAlign: "center", marginTop: '20px' }}>
                        <button type='submit' style={{ backgroundColor: "#377e22", color: '#fff', border: '1px solid #377e22', width: '150px', borderRadius: "5px" }}>Save</button>
                    </div>
                </form>}


            </Box>
        </Modal>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '75px', }}>
            <h2 style={{ textAlign: 'start' }}>News</h2>
            <div style={{ width: '150px' }} className="col-sm-8 col-9 text-right m-b-20" onClick={() => { handleOpen(); setFlag(false) }}>
                <div className="btn btn-primary float-right btn-rounded">
                    <i className="fa fa-plus"></i> Add News
                </div>
            </div>
        </div>


        <div className={styles.statCardGridDoctor}>
            {news.map(v =>
                <div key={v._id} onClick={() => { setNew(v); handleOpen(); setFlag(true) }} className={`${styles.box} ${styles.statCard}`}>
                    <div className={styles.title}>{v.title}</div>
                    <div className={styles.content}>{v.content}</div>
                </div>
            )}
        </div>
    </Box>
}