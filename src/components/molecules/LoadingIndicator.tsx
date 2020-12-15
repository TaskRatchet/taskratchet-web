import TopBarProgress from "react-topbar-progress-indicator";
import React from "react";
import {useIsFetching} from "react-query";

const LoadingIndicator = () => {
    const isFetching = useIsFetching()

    return isFetching ? <TopBarProgress /> : null
}

export default LoadingIndicator
