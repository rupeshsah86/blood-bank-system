import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  className = '',
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = `card-${variant}`;
  const paddingClass = `card-padding-${padding}`;
  const shadowClass = `card-shadow-${shadow}`;
  const hoverClass = hover ? 'card-hover' : '';
  
  const classes = [baseClass, variantClass, paddingClass, shadowClass, hoverClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;