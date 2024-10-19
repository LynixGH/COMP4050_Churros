// components/SignInForm.jsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SignInForm = () => {
    return (
        <>
  
            <div className="flex flex-col justify-center items-center bg-white h-[50vh]">
                <div className="mx-auto flex w-full flex-col justify-center px-5 md:max-w-[50%] lg:max-w-[50%] lg:px-6">
                    <a className="mt-10 w-fit text-zinc-950 dark:text-white" href="/">
                        <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
                            {/* SVG for back link */}
                        </div>
                    </a>
                    <div className="my-auto mt-8 flex flex-col w-[350px] max-w-[450px] mx-auto">
                        <p className="text-[32px] font-bold text-zinc-950 dark:text-white">Sign In</p>
                        <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">Enter your email and password to sign in!</p>
                        <div className="mt-8">
                            <form className="pb-2">
                                {/* Google sign-in button */}
                            </form>
                        </div>
                        <div className="relative my-4">
                            <div className="relative flex items-center py-1">
                                <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
                                <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                        </div>
                        <div>
                            <form noValidate className="mb-4">
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <label className="text-zinc-950 dark:text-white" htmlFor="email">Email</label>
                                        <input
                                            className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            name="email"
                                        />
                                        <label className="text-zinc-950 mt-2 dark:text-white" htmlFor="password">Password</label>
                                        <input
                                            id="password"
                                            placeholder="Password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                                            name="password"
                                        />
                                    </div>
                                    <Link href="/userDashboard">
                                        <button
                                            className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
                                            type="submit"
                                        >
                                            Sign in
                                        </button>
                                    </Link>
                                </div>
                            </form>
                            {/* Forgot password, magic link, and sign-up links */}
                        </div>
                    </div>
                </div>
                {/* Footer or additional info */}
            </div>
        </>
    );
};

export default SignInForm;
