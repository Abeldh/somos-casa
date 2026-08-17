import { classNames } from '../../utils/helpers';

export default function Card({ children, className, ...props }) {
  return (
    <div className={classNames('card', className)} {...props}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }) {
  return <div className={classNames('px-6 py-4 border-b border-gray-100', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className }) {
  return <div className={classNames('px-6 py-4', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return <div className={classNames('px-6 py-4 border-t border-gray-50 bg-gray-50/50', className)}>{children}</div>;
};
