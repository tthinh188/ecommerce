import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    container: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    header: {
        padding: '20px',
    },
    button: {
        marginTop: '20px',
    }
}));