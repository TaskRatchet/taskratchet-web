import React, {useEffect, useState} from 'react';
import api from '../../../classes/Api';
import Toaster from "../../../classes/Toaster";
import queryString from 'query-string'
import {isProduction} from "../../../tr_constants"
import Input from "../../molecules/Input";

// ex: {list: "summaries", t: "abc"}
const params: any = queryString.parse(window.location.search);

interface ManageEmailProps {
}

const ManageEmail = (props: ManageEmailProps) => {
    return <div className={'page-manageEmail'}>Hello World</div>
}

export default ManageEmail