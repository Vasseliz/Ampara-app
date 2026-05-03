import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card } from "../../atoms/Card/Card";

export function AuthShell({ title, subtitle, className = "", children }) {
    return (
        <motion.div
            className={`auth__sheet ${className}`.trim()}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Card className="auth__sheet-card">
                <div className="auth__handle" />

                <Link to="/" className="auth__logo">
                    <div className="auth__logo-icon"><Heart size={20} /></div>
                    <span className="auth__logo-name">MindCare</span>
                </Link>

                <div className="auth__heading">
                    <h1>{title}</h1>
                    {subtitle ? <p>{subtitle}</p> : null}
                </div>

                {children}
            </Card>
        </motion.div>
    );
}
