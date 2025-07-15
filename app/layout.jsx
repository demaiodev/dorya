import '../styles/globals.css';
import { Header } from '../components/header';

export const metadata = {
    title: {
        default: 'DORYA - A Mishima Practice Tool'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.png" sizes="any" />
            </head>
            <body className="antialiased text-white bg-indigo-900">
                <div className="flex flex-col min-h-screen px-6 bg-noise sm:px-12">
                    <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                        <Header />
                        <main className="grow">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}
