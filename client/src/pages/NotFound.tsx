import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] px-6 py-16 flex items-center justify-center">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">404</p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Page introuvable
        </h1>
        <p className="text-base text-gray-600">
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
};
