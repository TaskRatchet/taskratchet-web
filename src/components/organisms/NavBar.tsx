import {AppBar, Button, Drawer, IconButton, Toolbar, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import './NavBar.css'
import MenuIcon from "@material-ui/icons/Menu";
import TodayIcon from '@material-ui/icons/Today';
import {logout, useSession} from "../../lib/api/useSession";

export default function NavBar() {
    const session = useSession();
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleMenu = () => setIsOpen(!isOpen)

    return <AppBar className={'organism-navBar'} position="static">
        <Toolbar>
            <Typography className={'organism-navBar__title'} variant="h6" component="div">
                <Button component={Link} to={'/'} color={'inherit'}>TaskRatchet</Button>
            </Typography>
            <span>
                <IconButton edge="start" color="inherit" aria-label="today">
                    <TodayIcon />
                </IconButton>

                <IconButton onClick={toggleMenu} edge="start" color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
            </span>
        </Toolbar>
        <Drawer className={'organism-navBar__drawer'} anchor={'right'} open={isOpen} onClose={toggleMenu}>
            {session && <>
                <Typography>{session.email}</Typography>
                <Button className={'link'} onClick={logout} color="inherit">Logout</Button>
                <Button component={Link} to={'/account'} color="inherit">Account</Button>
            </>}
            {/*TODO: rel noopener etc*/}
            <Button href={'https://docs.taskratchet.com'} target={'_blank'} color="inherit">Help</Button>
        </Drawer>
    </AppBar>
}
