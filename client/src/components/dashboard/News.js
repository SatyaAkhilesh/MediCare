import styles from './Dashboard.module.css';
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
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getNews = () => {
        axios.get('http://localhost:3001/news').then(res => {
            // console.log(res.data.data)
            setNews(res.data.data.map(v => {
                return v;
            }))

        })
    }
    useEffect(() => { getNews() }, [])
    return <div className={styles.news}>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box sx={style}>
                <AiOutlineClose onClick={handleClose} style={{ float: 'right', margin: "-10px 10px 0 0", cursor: "pointer" }}></AiOutlineClose>
                <h4 style={{ textAlign: 'center' }}>{newContent.title}</h4>
                <div style={{ padding: '10px' }}>{newContent.content}</div>
            </Box>
        </Modal>
        <h2>News</h2>
        <div className={styles.statCardGridDoctor}>
            {news.map(v =>
                <div key={v._id} onClick={() => { setNew(v); handleOpen() }} className={`${styles.box} ${styles.statCard}`}>
                    <div className={styles.title}>{v.title}</div>
                    <div className={styles.content}>{v.content}</div>
                </div>
            )}
        </div>
    </div >
}