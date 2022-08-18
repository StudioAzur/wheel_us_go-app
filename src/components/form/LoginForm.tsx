import { useContext, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
type LoginFormValues = {
    email: string;
    password: string;
}

const LoginForm: React.FC<unknown> = () => {
	const { register, handleSubmit, formState: {errors}} = useForm<LoginFormValues>();
    const onSubmit: SubmitHandler<LoginFormValues> = data => console.log(data);
    const {state, dispatch} = useContext(AuthContext)
	useEffect(() => {
		console.log(state.user);
		
	}, [])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input placeholder="Votre adresse mail" type="email" {...register("email", { required: true })} />
			{errors.email && <span>Adresse mail requise</span>}
			<input placeholder="Votre mot de passe" type="password" {...register("password", { required: true })} />
			{errors.password && <span>Mot de passe requis</span>}
			<button type="submit">Se connecter</button> 
		</form>
	);
};

export default LoginForm;
