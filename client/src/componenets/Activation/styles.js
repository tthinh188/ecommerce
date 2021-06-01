import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    paper: {
        width: '75%',
        position: 'absolute',
        left: '50%',
        top: '25%',
        transform: 'translate(-50%, -50%)',
    },
    resend: {
        color: 'blue',
        cursor: 'pointer',
        textDecoration: 'underline',
        '&:hover': {
            textDecoration: 'none',
        }
    }
    
}));