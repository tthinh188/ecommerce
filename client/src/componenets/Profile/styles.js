import { makeStyles } from '@material-ui/core/styles';


export default makeStyles((theme) => ({
    profile: {
        marginTop: '20px',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    avatar: {
        margin: 'auto',
    },
    profileInfo: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

}));