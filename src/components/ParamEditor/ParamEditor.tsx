import React from "react";
import s from './ParamEditor.module.css'
import settingsImg from '../../Img/settings.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

interface Param {
    id: number, 
    name: string,    
}

interface ParamValue {
    id: number,
    paramId: number,
    value: string
}

interface Model {
    paramValue: ParamValue[],
    colors: string[]
}

interface Props {    
    params: Param[],
    model: Model    
}

interface State extends Props {
    selectedId: number | null,
    editParams: boolean,
    showModalWindow: boolean,
    showModalWindowRemovePar: boolean,
    editModelValue: {status: boolean, currentEdit: number | null},
    editParamsValue: boolean,
    changingValueEdit: string,  
    changingValueCreate: string,
    allowParameterCreation: boolean
}

class ParamEditor extends React.Component<Props, State> {
    
    state = {
        params: this.props.params,
        model: this.props.model,
        selectedId: null,  // Selected field to change
        editParams: false, 
        showModalWindow: false, 
        showModalWindowRemovePar: false,
        editModelValue: {status: false, currentEdit: null},
        editParamsValue: false,
        changingValueEdit: '',
        changingValueCreate: '',
        allowParameterCreation: false        
    }  
    
    // To open the settings menu for each params/model separately
    onClickShowSetting(idParams: number) {
        this.setState({
            selectedId: idParams,
        })     
    }   

    // Show modal window for params
    changeEditParams() {
        this.setState({
            editParams: true
        })
    }

    // allow change params
    allowChangeParams() {
        this.setState({
            editParamsValue: true
        })
    }

    // Change the value of the parameters after closing the modal window and cleaning up the value
    onChangeParamsValue() {
       this.setState({
            params: structuredClone(this.state.params).map((e: { name: string, id: number }) => {
                if (this.state.selectedId === e.id) {
                    e.name = this.state.changingValueCreate
                }
                return e
            }),
            changingValueCreate: '',
            selectedId: null,
            editParams: false
       })      
    }
   
    //Open model for remove params
    onShowEditModalRemovePar() {
        this.setState({
            showModalWindowRemovePar: true
        })
    }

    //Remove params from state and all models of the current parameter
    removeParams() {        
        this.setState({
            params: this.state.params.filter(p => p.id !== this.state.selectedId),
            model: {
                ...this.state.model,
                paramValue: this.state.model.paramValue.filter(m => m.paramId !== this.state.selectedId)
            },
            selectedId: null,
            showModalWindowRemovePar: false
        })        
    }   
    
    
    // Close model windows for remove params
    closeModalRemovePar() {
        this.setState({   
            selectedId: null,         
            showModalWindowRemovePar: false
        })
    }

    // Show modal window for models
    onShowEditModal() {
        this.setState({
            showModalWindow: true
        })
    }    

    editModelValueF(status: boolean, currentEdit: null | number) {
        this.setState({
            editModelValue: {
                ...this.state.editModelValue,
                status,
                currentEdit
            }
        })    
    }

    // allow changing the selected model
    allowCSelectModel(idModel: number) {
        this.editModelValueF(true, idModel)              
    }

    // Edit value in model and clear editModelValue
    saveEditModelValue(idModel: number) {
         
        this.setState({
            model: {
                ...this.state.model,
                paramValue: structuredClone(this.state.model.paramValue).map((e: { value: string, id: number }) => {
                    if (idModel === e.id) {
                        e.value = this.state.changingValueEdit
                    }
                    return e
                })
                
            }
        })        
        this.editModelValueF(false, null) 
        this.state.changingValueEdit = ''
    }

    //Create new model
    addModel() {
        if (this.state.selectedId && this.state.changingValueCreate) {
            const obj: ParamValue = { 
                id: Date.now(),
                paramId: this.state.selectedId, 
                value: this.state.changingValueCreate              
            }        
            this.setState({
                model: {
                    ...this.state.model,
                    paramValue: [...this.state.model.paramValue, obj]
                }
            })
            this.state.changingValueCreate = ''
        } else {
            return console.error(`An error has occurred`)
        } 
    }

    //Remove model from state 
    removeModel(idModel: number) {
        this.setState({
            model: {
                ...this.state.model,
                paramValue: this.state.model.paramValue.filter(e => e.id !== idModel)
            }
        })
    } 

    // Close the modal and clear the selectId
    closeModal() {
        this.setState({
            selectedId: null,
            showModalWindow: false
        })
    }
    
    createNewParams() {
        const newParams: Param = {
            id: Date.now(),
            name: this.state.changingValueEdit 
        }
        this.setState({
            params: [...this.state.params, newParams],
            allowParameterCreation: false
        })
    }    

    render() {
        const {
            params, model, selectedId, editModelValue, editParamsValue, 
            showModalWindow, allowParameterCreation, changingValueEdit 
        } = this.state
        return (
            <div className={s.main}>                
                {params.map(p => 
                    <div key={p.id} className={s.block}>                       
                        <div className={s.title}>{p.name}</div>                 
                        <select  className={s.select}>
                            {/* Each parameter has its own model */}
                            {model.paramValue.filter(m => m.paramId === p.id).map(m =>
                                <option key={m.id}>{m.value}</option>
                            )}
                            {/* if there are no models, then leave option empty */}
                            {model.paramValue.every(m => m.paramId !== p.id ) && <option>Пусто</option>}
                        </select>
                        <div className={s.settingBlock}>
                            <img onClick={() => this.onClickShowSetting(p.id)} className={s.settingImg} src={settingsImg}/>                            
                            {selectedId === p.id &&
                                <div className={s.settingBlock__block}>  
                                    <div onClick={() => this.changeEditParams()} className={s.settingBlock__description}>Изменить параметр</div>
                                    <div 
                                        onClick={() => this.onShowEditModal()} 
                                        className={s.settingBlock__description}
                                    >
                                    Изменить модели
                                    </div>    
                                    <div onClick={() => this.onShowEditModalRemovePar()} className={s.settingBlock__description}>Удалить</div>                                
                                </div>
                            }
                        </div>                       
                    </div>                    
                )}  

                 {showModalWindow &&
                    <div className={s.modal}>
                        <div className={s.modal__block}>
                            <h2 className={s.modal__title}>Выберите поле для измениния:</h2>         
                            {/* We leave models only from the selected parametr */}                       
                            {model.paramValue
                                .filter(m => m.paramId === selectedId)  
                                .map(m => 
                                    <div key={m.id} className={s.modal__description}>
                                    {editModelValue.status && editModelValue.currentEdit === m.id 
                                        ?                                           
                                        <InputGroup>
                                            <Form.Control                                                        
                                                placeholder="Введите изменение"
                                                type='string'
                                                value={changingValueEdit}    
                                                onChange={(e) => 
                                                    this.setState({...this.state, changingValueEdit: e.target.value})}                                                   
                                            />
                                            <Button 
                                                onClick={() => this.saveEditModelValue(m.id)} 
                                                variant="info"                                                                                                                     
                                            >
                                                Сохранить
                                            </Button>
                                        </InputGroup>                                                    
                                        : 
                                        <> 
                                            <div className={s.modal__descriptionTitle}>{m.value}</div>
                                                <div className={s.modal__editAndDelit}>
                                                    <div 
                                                        onClick={() => this.allowCSelectModel(m.id)} 
                                                        className={s.modal__edit}
                                                    >
                                                        Изменить
                                                    </div>
                                                    <button 
                                                        onClick={() => this.removeModel(m.id)} 
                                                        className={s.modal__closs}
                                                    >
                                                        &#10006;
                                                    </button >
                                            </div>
                                        </>
                                    }
                                </div>
                            )}  
                            <Button 
                                variant="warning" 
                                className={s.modal__button}
                                onClick={() => this.closeModal()}
                            >
                                Закончить редактировани
                            </Button>                                                         
                        </div>
                        <div className={s.modal__createModel}>
                            <h4>Создание новую модель</h4>
                            <InputGroup>
                                <Form.Control                                                        
                                    placeholder="Введите изменение"
                                    type='string'
                                    value={this.state.changingValueCreate}    
                                    onChange={(e) => this.setState({...this.state, changingValueCreate: e.target.value})}                                                   
                                />
                                <Button 
                                    onClick={() => this.addModel()}
                                    variant="warning"                                                                                                                     
                                >
                                    Создать
                                </Button>
                            </InputGroup>
                        </div>
                    </div>
                }
                <div className={s.newParams__block}>
                    <Button onClick={() => this.setState({allowParameterCreation: true})}>Добавить новый параматер</Button>                                       
                </div>
                {allowParameterCreation && 
                        <div className={s.newParams__inputBlock}>
                            <input value={changingValueEdit} 
                            className={s.newParams__input} 
                            placeholder="Введите название параметра"
                            onChange={(e) => this.setState({...this.state, changingValueEdit: e.target.value})}  
                            />
                            <Button onClick={() => this.createNewParams()} className={s.newParams__inputButton}>Создать</Button>
                        </div>
                    } 
                {this.state.showModalWindowRemovePar && 
                    <div className={s.modal}>
                        <div className={s.modal__block}>
                            <h2>Вы уверены?</h2>
                            <p>Вместе с удалением параматера, удаляются все модули принадлежащие ему.</p>
                            <div className={s.button_block}>
                                <Button onClick={() => this.removeParams()} variant='success'>Да</Button>
                                <Button onClick={() => this.closeModalRemovePar()} variant='danger'>Отмена</Button>
                            </div>
                        </div>
                    </div>
                }  
                {this.state.editParams && 
                    <div className={s.modal}>
                        <div className={s.modal__block}>
                            <h2>Изменить параметр</h2>
                            {!editParamsValue ?
                                <div className={s.modal__changeParams}>                                
                                    <div className={s.modal__titleParams}>
                                        {params.find(e => e.id === this.state.selectedId)?.name}
                                    </div> 
                                    <div onClick={() => this.allowChangeParams()} className={s.modal__change}>&#9998;</div>
                                </div>
                                : 
                                <InputGroup>
                                    <Form.Control                                                        
                                        placeholder="Введите новый параметр"
                                        type='string'
                                        value={this.state.changingValueCreate}    
                                        onChange={(e) => this.setState({...this.state, changingValueCreate: e.target.value})}                                                   
                                    />
                                    <Button 
                                        onClick={() => this.onChangeParamsValue()}
                                        variant="warning"                                                                                                                     
                                    >
                                        Измениь
                                    </Button>
                                </InputGroup>
                            }                
                        </div>
                    </div>
                }                                  
            </div>
        );
      }
}

export default ParamEditor