package vg.samuel.justiniani.hackathon.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "FichasBibliograficas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FichaBibliografica {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdFicha")
    private Integer idFicha;
    
    @Column(name = "TipoDocumento")
    private String tipoDocumento;
    
    @Column(name = "Autor")
    private String autor;
    
    @Column(name = "Titulo")
    
    private String titulo;
    
    @Column(name = "AnioPublicacion")
    private Integer anioPublicacion;
    
    @Column(name = "Editorial")
    private String editorial;
    
    @Column(name = "NumeroEdicion")
    private String numeroEdicion;
    
    @Column(name = "NumeroPaginas")
    private Integer numeroPaginas;
    
    @Column(name = "Tema")
    private String tema;
    
    @Column(name = "FechaAgregada")
    @CreationTimestamp
    private LocalDate fechaAgregada;
    
    @Column(name = "Estado")
    private Boolean estado = true;
}
