"use client"
import { signIn, useSession, signOut } from 'next-auth/react'
import logoTipo from '@/assets/logos/logo-blanco.svg';
import logOut from '@/assets/icons/generales/logout.svg';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import FormRegister from '../Form/FormRegister';


function Navbar() {
  const { data: session } = useSession();

  const signInAccount = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

// Si no hay sesión, muestra solo la pantalla de login
if (!session?.user) {
  return (
    <div className="fixed inset-0 flex flex-col gap-48 justify-start pt-10 items-center bg-[url('../assets/img-login.jpg')] bg-cover bg-no-repeat">
      <div className='flex flex-col gap-8'>
        <Image
          src={logoTipo || "/placeholder.svg"}
          width={250}
          height={50}
          alt='Logotipo de Atomik'
        />
        <div className='flex flex-col items-center text-center'>
        </div>
      </div>
      <div className="">
        <div className='bg-transparent backdrop-blur-md h-64 flex flex-col 
        border-2 border-grisPrincipal border-opacity-80 justify-evenly items-center p-8 rounded-lg shadow-md'>
          <h1 className='font-bold text-2xl text-blanco'>
            Bienvenido al Registro de ajustes
          </h1>
          <button onClick={() => signInAccount()}
            className='bg-blanco px-4 py-3 font-bold rounded-2xl text-negro flex items-center justify-between w-full max-w-xs'
          >
            <div className="w-6" /> {/* Espaciador invisible para equilibrar el diseño */}
            <p className="text-center flex-grow">Logueate ahora</p>
            <FcGoogle className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Si hay sesión, muestra el nav y el formulario debajo
return (
  <>
    <nav className="relative flex-col items-center pt-8 justify-between m-1 h-[250px] rounded-lg px-4 bg-[url('../assets/img-header.jpg')] bg-cover bg-no-repeat'">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent backdrop-blur-sm rounded-b-lg pointer-events-none z-0"></div>
      <div className="flex justify-between h-8 w-full items-center text-center">
        <div className='flex items-center w-[150px] gap-[5px]'>
          <img
            src={session.user.image! || "/placeholder.svg"}
            alt='Imagen de Usuario'
            className='w-10 h-10 rounded-full cursor-pointer'
          />
          <p className='text-blanco text-sm'>{session.user.name}</p>
          <button
            onClick={async () => {
              await signOut({
                callbackUrl: "/"
              });
            }}
          >
            <Image
              src={logOut || "/placeholder.svg"}
              width={20}
              height={20}
              alt="Icono para cerrar sesion"
            />
          </button>
        </div>
        <div className='flex'>
          <Image
            src={logoTipo || "/placeholder.svg"}
            width={150}
            height={50}
            alt='Logotipo de Atomik'
          />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center text-center mb-4 mt-4 gap-2'>
        <h1 className='text-4xl font-light text-blanco uppercase tracking-widest'>
          REGISTRO DE AJUSTES
        </h1>
        <h2 className='text-l font-light text-blanco'>
          2.0
        </h2>
      </div>
    </nav>
    
    {/* FormRegister ahora está fuera del nav */}
    <FormRegister />
  </>
);
}

export default Navbar;