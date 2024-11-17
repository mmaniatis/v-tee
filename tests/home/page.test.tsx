// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

// Mock next/link
jest.mock('next/link', () => {
  return ({children, href}: {children: React.ReactNode, href: string}) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Home Page', () => {
  it('renders all feature cards', () => {
    render(<Home />);
    expect(screen.getByText('Booking Management')).toBeInTheDocument();
    expect(screen.getByText('Automated Operations')).toBeInTheDocument();
    expect(screen.getByText('Business Analytics')).toBeInTheDocument();
    expect(screen.getByText('Customer Management')).toBeInTheDocument();
  });

  it('renders demo buttons with correct links', () => {
    render(<Home />);
    const demoLinks = screen.getAllByRole('link', { name: /try demo/i });
    
    // Check if at least one demo link exists and points to the correct path
    expect(demoLinks.length).toBeGreaterThan(0);
    expect(demoLinks[0]).toHaveAttribute('href', '/1');
  });

  it('renders admin panel link', () => {
    render(<Home />);
    const adminLink = screen.getByRole('link', { name: /demo admin panel/i });
    expect(adminLink).toHaveAttribute('href', '/admin/1');
  });

  it('renders all sections', () => {
    render(<Home />);
    
    // Hero section
    expect(screen.getByText(/maximize revenue/i)).toBeInTheDocument();
    
    // Features section
    expect(screen.getByText(/Built for Golf Simulator Businesses/i)).toBeInTheDocument();
    
    // CTA section
    expect(screen.getByText(/Ready to streamline your business/i)).toBeInTheDocument();
  });
});