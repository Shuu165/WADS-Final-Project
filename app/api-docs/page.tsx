"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

const ApiDocsPage = () => {
    const [spec, setSpec] = useState(null);

    useEffect(() => {
        fetch("/api/docs")
            .then((res) => res.json())
            .then((data) => setSpec(data));
    }, []);

    if (!spec) return <div className="p-8">Loading API docs...</div>;

    return (
        <div className="min-h-screen">
            <SwaggerUI spec={spec} />
        </div>
    );
};

export default ApiDocsPage;