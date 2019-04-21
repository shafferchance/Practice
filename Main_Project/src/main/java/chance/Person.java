package chance;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GeneraationType;
import javax.persistence.Id;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String firstName;
    private String lastName;
}