import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <p className="text-sm">
                <Link
                    href="https://github.com/demaiodev"
                    className="decoration-dashed text-primary underline-offset-8"
                >
                    demaiodev
                </Link>
            </p>
        </footer>
    );
}
