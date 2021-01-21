import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(4),
    },
    downloadButton: {
      margin: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    chipBox: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      minHeight: 50,
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    paper: {
      paddingTop: theme.spacing(3),
      padding: theme.spacing(2),
    },
    formControl: {
      marginBottom: theme.spacing(2),
      minWidth: 130,
    },
    mathOptions: {
      minWidth: 200,
    },
    heading: {
      fontSize: theme.typography.pxToRem(18),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);
